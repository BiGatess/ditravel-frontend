import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Tag, ChevronDown } from 'lucide-react';
import axiosClient from '../../api/axios';
import Toast, { ToastMessage } from '../../components/admin/Toast';
import { formatVnd, formatVndInput, formatVndInputValue, parseVndInput } from '../../utils/currency';

type VoucherForm = {
  code: string;
  title: string;
  description: string;
  discount_type: 'PERCENT' | 'FIXED';
  discount_value: string;
  min_order_value: string;
  max_discount_value: string;
  usage_limit: string;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  is_active: boolean;
};

const emptyForm: VoucherForm = {
  code: '',
  title: '',
  description: '',
  discount_type: 'PERCENT',
  discount_value: '',
  min_order_value: '',
  max_discount_value: '',
  usage_limit: '',
  start_date: '',
  end_date: '',
  status: 'ACTIVE',
  is_active: true,
};

const toDateInput = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 16) : '';
const fromDateInput = (value: string) => value ? new Date(value).toISOString() : null;
const parsePercent = (value: string) => Number(String(value || '').replace(/[^\d.]/g, '') || 0);

const DropdownSelect = ({ label, value, options, onChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt: any) => opt.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between border rounded-lg p-3 text-[14px] outline-none transition-colors bg-white ${isOpen ? 'border-slate-400' : 'border-slate-300 hover:border-slate-400'}`}
      >
        <span className="text-slate-800">{label}: <span className="font-bold text-[#0084ff]">{selectedOption?.label}</span></span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[220px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 py-2 z-50 animate-dropdown">
          {options.map((opt: any) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-3 ${value === opt.value ? 'text-[#0084ff] font-bold bg-blue-50/50' : 'text-slate-700 hover:bg-slate-50'}`}
            >
              <span className="truncate">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<any | null>(null);
  const [form, setForm] = useState<VoucherForm>(emptyForm);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/vouchers/');
      setVouchers(res.data || []);
    } catch (error: any) {
      setToast({ title: 'Lỗi tải voucher', message: error.response?.data?.detail || 'Không thể tải danh sách voucher.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const filteredVouchers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vouchers;
    return vouchers.filter(voucher =>
      voucher.code?.toLowerCase().includes(q) ||
      voucher.title?.toLowerCase().includes(q)
    );
  }, [vouchers, query]);

  const openModal = (voucher: any = null) => {
    setEditingVoucher(voucher);
    setForm(voucher ? {
      code: voucher.code || '',
      title: voucher.title || '',
      description: voucher.description || '',
      discount_type: voucher.discount_type || 'PERCENT',
      discount_value: voucher.discount_type === 'FIXED' ? formatVndInputValue(voucher.discount_value) : String(Number(voucher.discount_value || 0)),
      min_order_value: voucher.min_order_value ? formatVndInputValue(voucher.min_order_value) : '',
      max_discount_value: voucher.max_discount_value ? formatVndInputValue(voucher.max_discount_value) : '',
      usage_limit: voucher.usage_limit ? String(voucher.usage_limit) : '',
      start_date: toDateInput(voucher.start_date),
      end_date: toDateInput(voucher.end_date),
      status: voucher.status || 'ACTIVE',
      is_active: voucher.is_active !== false,
    } : emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVoucher(null);
    setForm(emptyForm);
  };

  const buildPayload = () => ({
    code: form.code.trim().toUpperCase(),
    title: form.title.trim(),
    description: form.description.trim() || null,
    discount_type: form.discount_type,
    discount_value: form.discount_type === 'FIXED' ? parseVndInput(form.discount_value) : parsePercent(form.discount_value),
    min_order_value: form.min_order_value ? parseVndInput(form.min_order_value) : null,
    max_discount_value: form.max_discount_value ? parseVndInput(form.max_discount_value) : null,
    usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
    start_date: fromDateInput(form.start_date),
    end_date: fromDateInput(form.end_date),
    status: form.status,
    is_active: form.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.title.trim() || !form.discount_value.trim()) {
      setToast({ title: 'Thiếu thông tin', message: 'Vui lòng nhập mã, tiêu đề và giá trị giảm.', type: 'error' });
      return;
    }

    try {
      const payload = buildPayload();
      if (editingVoucher) {
        await axiosClient.put(`/vouchers/${editingVoucher.id}`, payload);
      } else {
        await axiosClient.post('/vouchers/', payload);
      }
      await fetchVouchers();
      closeModal();
      setToast({ title: 'Đã lưu voucher', message: 'Voucher đã được đồng bộ với backend.' });
    } catch (error: any) {
      setToast({ title: 'Lỗi lưu voucher', message: error.response?.data?.detail || 'Không thể lưu voucher.', type: 'error' });
    }
  };

  const handleDelete = async (voucher: any) => {
    if (!window.confirm(`Xóa voucher ${voucher.code}?`)) return;
    try {
      await axiosClient.delete(`/vouchers/${voucher.id}`);
      await fetchVouchers();
      setToast({ title: 'Đã xóa voucher', message: `Voucher ${voucher.code} đã được xóa.`, type: 'delete' });
    } catch (error: any) {
      setToast({ title: 'Lỗi xóa voucher', message: error.response?.data?.detail || 'Không thể xóa voucher.', type: 'error' });
    }
  };

  const formatDiscount = (voucher: any) => {
    if (voucher.discount_type === 'PERCENT') return `${Number(voucher.discount_value || 0)}%`;
    return formatVnd(voucher.discount_value);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Voucher</h1>
          <p className="text-[13px] text-slate-500 mt-1">Tạo và quản lý mã ưu đãi dùng trong đơn hàng.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-[#ff5b00] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#e65200]">
          <Plus className="w-4 h-4" /> Thêm voucher
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm mã hoặc tiêu đề voucher..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[12px] uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Voucher</th>
                <th className="px-5 py-3">Giảm giá</th>
                <th className="px-5 py-3">Điều kiện</th>
                <th className="px-5 py-3">Lượt dùng</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {isLoading ? (
                <tr><td colSpan={6} className="py-10 text-center text-slate-500">Đang tải voucher...</td></tr>
              ) : filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Tag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Chưa có voucher nào.
                  </td>
                </tr>
              ) : filteredVouchers.map(voucher => (
                <tr key={voucher.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-800">{voucher.code}</div>
                    <div className="text-[12px] text-slate-500">{voucher.title}</div>
                  </td>
                  <td className="px-5 py-4 font-bold text-[#ff5b00]">{formatDiscount(voucher)}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">
                    <div>Tối thiểu: {voucher.min_order_value ? formatVnd(voucher.min_order_value) : 'Không'}</div>
                    <div>Giảm tối đa: {voucher.max_discount_value ? formatVnd(voucher.max_discount_value) : 'Không giới hạn'}</div>
                  </td>
                  <td className="px-5 py-4">{voucher.used_count || 0}{voucher.usage_limit ? ` / ${voucher.usage_limit}` : ''}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded text-[12px] font-bold ${voucher.status === 'ACTIVE' && voucher.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {voucher.status === 'ACTIVE' && voucher.is_active ? 'Đang dùng' : voucher.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openModal(voucher)} className="p-2 text-slate-400 hover:text-[#0084ff] hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(voucher)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">{editingVoucher ? 'Sửa voucher' : 'Thêm voucher'}</h2>
              <button type="button" onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Mã voucher" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <DropdownSelect
                label="Loại giảm"
                value={form.discount_type}
                options={[
                  { value: 'PERCENT', label: 'Giảm theo phần trăm' },
                  { value: 'FIXED', label: 'Giảm số tiền cố định' },
                ]}
                onChange={(value: VoucherForm['discount_type']) => setForm({ ...form, discount_type: value, discount_value: '' })}
              />
              <input value={form.discount_value} onChange={e => setForm({ ...form, discount_value: form.discount_type === 'FIXED' ? formatVndInput(e.target.value) : e.target.value.replace(/[^\d.]/g, '') })} onBlur={() => form.discount_type === 'FIXED' && setForm(prev => ({ ...prev, discount_value: formatVndInputValue(prev.discount_value) }))} placeholder={form.discount_type === 'FIXED' ? '100.000' : '10'} className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input value={form.min_order_value} onChange={e => setForm({ ...form, min_order_value: formatVndInput(e.target.value) })} onBlur={() => setForm(prev => ({ ...prev, min_order_value: formatVndInputValue(prev.min_order_value) }))} placeholder="Đơn tối thiểu" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input value={form.max_discount_value} onChange={e => setForm({ ...form, max_discount_value: formatVndInput(e.target.value) })} onBlur={() => setForm(prev => ({ ...prev, max_discount_value: formatVndInputValue(prev.max_discount_value) }))} placeholder="Giảm tối đa" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input type="number" min="0" value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} placeholder="Giới hạn lượt dùng" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <DropdownSelect
                label="Trạng thái"
                value={form.status}
                options={[
                  { value: 'ACTIVE', label: 'ACTIVE' },
                  { value: 'INACTIVE', label: 'INACTIVE' },
                  { value: 'EXPIRED', label: 'EXPIRED' },
                ]}
                onChange={(value: VoucherForm['status']) => setForm({ ...form, status: value })}
              />
              <input type="datetime-local" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input type="datetime-local" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" className="md:col-span-2 border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] min-h-[90px]" />
              <label className="md:col-span-2 flex items-center gap-2 text-[13px] font-bold text-slate-600">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                Cho phép sử dụng voucher
              </label>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-[13px] font-bold">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#ff5b00] text-white text-[13px] font-bold">Lưu voucher</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
