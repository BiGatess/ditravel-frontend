import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CreditCard, QrCode, Save, ShieldCheck } from 'lucide-react';
import axiosClient from '../../api/axios';
import Toast, { ToastMessage } from '../../components/admin/Toast';

type PaymentConfig = {
  enabled: boolean;
  bank_code: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  transfer_note_prefix: string;
  qr_template: string;
  webhook_url: string;
  webhook_secret: string;
  support_phone: string;
  support_email: string;
  description: string;
};

const DEFAULT_CONFIG: PaymentConfig = {
  enabled: true,
  bank_code: 'VCB',
  bank_name: 'Vietcombank',
  account_number: '0071001060528',
  account_name: 'CT TNHH DI VUI',
  transfer_note_prefix: '119123',
  qr_template: 'compact2',
  webhook_url: '',
  webhook_secret: '',
  support_phone: '1900 0000',
  support_email: 'hotro@ditravel.com',
  description: 'Cấu hình SePay / VietQR dùng cho checkout và xác nhận thanh toán.',
};

const settingKeys = Object.keys(DEFAULT_CONFIG) as (keyof PaymentConfig)[];

const toInput = (value: any, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
};

const toBoolean = (value: any, fallback = true) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') return value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
  return fallback;
};

export default function PaymentsPage() {
  const [form, setForm] = useState<PaymentConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ title, message, type });
  };

  const previewQrUrl = useMemo(() => {
    const bankCode = form.bank_code || DEFAULT_CONFIG.bank_code;
    const accountNumber = form.account_number || DEFAULT_CONFIG.account_number;
    const template = form.qr_template || DEFAULT_CONFIG.qr_template;
    const note = `${form.transfer_note_prefix || DEFAULT_CONFIG.transfer_note_prefix} Nguyen Van A`;
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.png?amount=150000&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(form.account_name || DEFAULT_CONFIG.account_name)}`;
  }, [form]);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/settings/');
      const map = new Map<string, any>();
      (res.data || []).forEach((item: any) => map.set(item.key, item.value));

      const nextForm: PaymentConfig = { ...DEFAULT_CONFIG };
      settingKeys.forEach((key) => {
        const value = map.get(`sepay.${String(key)}`) ?? map.get(`payment.${String(key)}`);
        if (value !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (nextForm as any)[key] = key === 'enabled' ? toBoolean(value, DEFAULT_CONFIG.enabled) : toInput(value, DEFAULT_CONFIG[key]);
        }
      });
      setForm(nextForm);
    } catch (error: any) {
      showToast('Lỗi tải cấu hình', error.response?.data?.detail || 'Không thể tải cấu hình thanh toán.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: keyof PaymentConfig, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value } as PaymentConfig));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        axiosClient.put('/settings/sepay.enabled', { value: form.enabled, description: 'Bật/tắt SePay trong checkout' }),
        axiosClient.put('/settings/sepay.bank_code', { value: form.bank_code.trim(), description: 'Mã ngân hàng dùng để tạo VietQR' }),
        axiosClient.put('/settings/sepay.bank_name', { value: form.bank_name.trim(), description: 'Tên ngân hàng hiển thị' }),
        axiosClient.put('/settings/sepay.account_number', { value: form.account_number.trim(), description: 'Số tài khoản nhận tiền' }),
        axiosClient.put('/settings/sepay.account_name', { value: form.account_name.trim(), description: 'Tên chủ tài khoản' }),
        axiosClient.put('/settings/sepay.transfer_note_prefix', { value: form.transfer_note_prefix.trim(), description: 'Tiền tố nội dung chuyển khoản' }),
        axiosClient.put('/settings/sepay.qr_template', { value: form.qr_template.trim() || 'compact2', description: 'Template VietQR' }),
        axiosClient.put('/settings/sepay.webhook_url', { value: form.webhook_url.trim(), description: 'Webhook URL từ SePay' }),
        axiosClient.put('/settings/sepay.webhook_secret', { value: form.webhook_secret.trim(), description: 'Webhook secret từ SePay' }),
        axiosClient.put('/settings/sepay.support_phone', { value: form.support_phone.trim(), description: 'Số hotline hỗ trợ' }),
        axiosClient.put('/settings/sepay.support_email', { value: form.support_email.trim(), description: 'Email hỗ trợ' }),
        axiosClient.put('/settings/sepay.description', { value: form.description.trim(), description: 'Mô tả cấu hình thanh toán' }),
      ]);
      showToast('Đã lưu', 'Cấu hình SePay đã được cập nhật.');
    } catch (error: any) {
      showToast('Lỗi lưu cấu hình', error.response?.data?.detail || 'Không thể lưu cấu hình SePay.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Thanh toán SePay</h1>
          <p className="text-[13px] text-slate-500 mt-1">Cấu hình ngân hàng, nội dung chuyển khoản và webhook cho checkout.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="inline-flex items-center gap-2 bg-[#ff5b00] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#e65200] disabled:opacity-70"
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-[#ff5b00]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-800">Thông tin tài khoản</h2>
                <p className="text-[13px] text-slate-500">Dùng để sinh QR và hiển thị cho khách thanh toán.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Bật thanh toán SePay</span>
                <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3">
                  <input type="checkbox" checked={form.enabled} onChange={(e) => handleChange('enabled', e.target.checked)} className="h-4 w-4 accent-[#ff5b00]" />
                  <span className="text-[13px] text-slate-600">{form.enabled ? 'Đang bật' : 'Đang tắt'}</span>
                </div>
              </label>

              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Mã ngân hàng</span>
                <input value={form.bank_code} onChange={(e) => handleChange('bank_code', e.target.value.toUpperCase())} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="VCB" />
              </label>

              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Tên ngân hàng</span>
                <input value={form.bank_name} onChange={(e) => handleChange('bank_name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="Vietcombank" />
              </label>

              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Số tài khoản</span>
                <input value={form.account_number} onChange={(e) => handleChange('account_number', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="0071001060528" />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="block text-[13px] font-semibold text-slate-700">Tên chủ tài khoản</span>
                <input value={form.account_name} onChange={(e) => handleChange('account_name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="CT TNHH DI VUI" />
              </label>

              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Tiền tố nội dung</span>
                <input value={form.transfer_note_prefix} onChange={(e) => handleChange('transfer_note_prefix', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="119123" />
              </label>

              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Mẫu QR</span>
                <input value={form.qr_template} onChange={(e) => handleChange('qr_template', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="compact2" />
              </label>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#0084ff]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-800">Webhook</h2>
                <p className="text-[13px] text-slate-500">Nếu dùng SePay thật, điền URL và secret webhook.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2 md:col-span-2">
                <span className="block text-[13px] font-semibold text-slate-700">Webhook URL</span>
                <input value={form.webhook_url} onChange={(e) => handleChange('webhook_url', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="https://your-domain.com/api/sepay/webhook" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="block text-[13px] font-semibold text-slate-700">Webhook secret</span>
                <input value={form.webhook_secret} onChange={(e) => handleChange('webhook_secret', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="secret-key" />
              </label>
              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Hotline</span>
                <input value={form.support_phone} onChange={(e) => handleChange('support_phone', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="1900 0000" />
              </label>
              <label className="space-y-2">
                <span className="block text-[13px] font-semibold text-slate-700">Email hỗ trợ</span>
                <input value={form.support_email} onChange={(e) => handleChange('support_email', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00]" placeholder="hotro@ditravel.com" />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="block text-[13px] font-semibold text-slate-700">Mô tả</span>
                <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full min-h-[100px] rounded-lg border border-slate-300 px-3 py-3 text-[14px] outline-none focus:border-[#ff5b00] resize-none" placeholder="Mô tả ngắn cho trang thanh toán" />
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-slate-800">QR preview</h2>
                <p className="text-[13px] text-slate-500">Mẫu sinh QR từ cấu hình hiện tại.</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-center rounded-lg bg-white border border-slate-200 p-4">
                <img src={previewQrUrl} alt="SePay QR preview" className="max-w-full h-auto object-contain" />
              </div>
              <div className="mt-4 space-y-2 text-[13px] text-slate-600">
                <div className="flex justify-between gap-3">
                  <span>Ngân hàng</span>
                  <span className="font-semibold text-slate-800">{form.bank_name || DEFAULT_CONFIG.bank_name}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Tài khoản</span>
                  <span className="font-semibold text-slate-800">{form.account_number || DEFAULT_CONFIG.account_number}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Chủ tài khoản</span>
                  <span className="font-semibold text-slate-800">{form.account_name || DEFAULT_CONFIG.account_name}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Nội dung mẫu</span>
                  <span className="font-semibold text-slate-800">{form.transfer_note_prefix || DEFAULT_CONFIG.transfer_note_prefix} + tên khách</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 mb-1">Lưu ý triển khai</h3>
                <p className="text-[13px] text-slate-500 leading-5">
                  Phần này đã cho phép cấu hình SePay và sinh QR động ở checkout. Nếu bạn muốn xác nhận thanh toán tự động thật sự, bước tiếp theo là thêm webhook callback từ SePay vào backend.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
