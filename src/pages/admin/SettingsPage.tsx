import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Settings } from 'lucide-react';
import axiosClient from '../../api/axios';
import Toast, { ToastMessage } from '../../components/admin/Toast';

type SettingForm = {
  key: string;
  value: string;
  description: string;
};

const emptyForm: SettingForm = { key: '', value: '', description: '' };

const valueToInput = (value: any) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
};

const inputToValue = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any | null>(null);
  const [form, setForm] = useState<SettingForm>(emptyForm);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/settings/');
      setSettings(res.data || []);
    } catch (error: any) {
      setToast({ title: 'Lỗi tải cài đặt', message: error.response?.data?.detail || 'Không thể tải cài đặt.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const filteredSettings = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return settings;
    return settings.filter(setting =>
      setting.key?.toLowerCase().includes(q) ||
      setting.description?.toLowerCase().includes(q)
    );
  }, [settings, query]);

  const openModal = (setting: any = null) => {
    setEditingSetting(setting);
    setForm(setting ? {
      key: setting.key || '',
      value: valueToInput(setting.value),
      description: setting.description || '',
    } : emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSetting(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key.trim()) {
      setToast({ title: 'Thiếu key', message: 'Vui lòng nhập key cài đặt.', type: 'error' });
      return;
    }

    try {
      const payload = {
        key: form.key.trim(),
        value: inputToValue(form.value),
        description: form.description.trim() || null,
      };

      if (editingSetting) {
        await axiosClient.put(`/settings/${editingSetting.key}`, {
          value: payload.value,
          description: payload.description,
        });
      } else {
        await axiosClient.post('/settings/', payload);
      }
      await fetchSettings();
      closeModal();
      setToast({ title: 'Đã lưu cài đặt', message: 'Cài đặt hệ thống đã được đồng bộ.' });
    } catch (error: any) {
      setToast({ title: 'Lỗi lưu cài đặt', message: error.response?.data?.detail || 'Không thể lưu cài đặt.', type: 'error' });
    }
  };

  const handleDelete = async (setting: any) => {
    if (!window.confirm(`Xóa cài đặt ${setting.key}?`)) return;
    try {
      await axiosClient.delete(`/settings/${setting.key}`);
      await fetchSettings();
      setToast({ title: 'Đã xóa cài đặt', message: `Cài đặt ${setting.key} đã được xóa.`, type: 'delete' });
    } catch (error: any) {
      setToast({ title: 'Lỗi xóa cài đặt', message: error.response?.data?.detail || 'Không thể xóa cài đặt.', type: 'error' });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Cài đặt hệ thống</h1>
          <p className="text-[13px] text-slate-500 mt-1">Quản lý các key cấu hình dùng chung cho website.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-[#ff5b00] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#e65200]">
          <Plus className="w-4 h-4" /> Thêm cài đặt
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm key cài đặt..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[12px] uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Value</th>
                <th className="px-5 py-3">Mô tả</th>
                <th className="px-5 py-3">Cập nhật</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {isLoading ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-500">Đang tải cài đặt...</td></tr>
              ) : filteredSettings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Settings className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Chưa có cài đặt nào.
                  </td>
                </tr>
              ) : filteredSettings.map(setting => (
                <tr key={setting.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-mono font-bold text-slate-800">{setting.key}</td>
                  <td className="px-5 py-4">
                    <pre className="max-w-[420px] whitespace-pre-wrap break-words text-[12px] bg-slate-50 border border-slate-100 rounded p-2 text-slate-600">{valueToInput(setting.value)}</pre>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{setting.description || '-'}</td>
                  <td className="px-5 py-4 text-[13px] text-slate-500">{setting.updated_at ? new Date(setting.updated_at).toLocaleString('vi-VN') : '-'}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openModal(setting)} className="p-2 text-slate-400 hover:text-[#0084ff] hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(setting)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="font-bold text-slate-800">{editingSetting ? 'Sửa cài đặt' : 'Thêm cài đặt'}</h2>
              <button type="button" onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              <input
                value={form.key}
                disabled={Boolean(editingSetting)}
                onChange={e => setForm({ ...form, key: e.target.value })}
                placeholder="Key, ví dụ: site.contact_phone"
                className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] disabled:bg-slate-50 disabled:text-slate-500"
              />
              <textarea
                value={form.value}
                onChange={e => setForm({ ...form, value: e.target.value })}
                placeholder='Value dạng text hoặc JSON, ví dụ: {"phone":"1900 0000"}'
                className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] min-h-[180px] font-mono"
              />
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả cài đặt"
                className="w-full border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] min-h-[90px]"
              />
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-[13px] font-bold">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#ff5b00] text-white text-[13px] font-bold">Lưu cài đặt</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
