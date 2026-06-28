import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Filter, Eye, X, CheckCircle, AlertTriangle, 
  Ban, Check, UserCircle, Mail, Phone, Calendar, ShoppingBag, DollarSign, Save
} from 'lucide-react';
import Toast, { ToastMessage, ToastType } from '../../components/admin/Toast';

import axiosClient from '../../api/axios';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'banned';
  role: 'ADMIN' | 'USER';
  internalNote: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUsers();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/users');
      const formatted = res.data.map((u: any) => {
        let dateStr = 'N/A';
        if (u.created_at) {
          try {
            // Fix parsing issues for ISO strings with microseconds or missing Z
            const cleanDateString = u.created_at.split('.')[0] + 'Z';
            const dateObj = new Date(cleanDateString);
            if (!isNaN(dateObj.getTime())) {
              dateStr = dateObj.toLocaleDateString('vi-VN');
            } else {
              // Fallback manual parsing if Date still fails
              const parts = u.created_at.split('T')[0].split('-');
              if (parts.length === 3) dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
          } catch (e) {
            console.error(e);
          }
        }

        return {
          id: u.id,
          name: u.full_name,
          email: u.email,
          phone: u.phone || 'Chưa cập nhật',
          avatarUrl: undefined,
          joinedAt: dateStr,
          totalOrders: 0, // Mock
          totalSpent: 0, // Mock
          status: u.status === 'BLOCKED' ? 'banned' : 'active',
          role: u.user_type === 'ADMIN' ? 'ADMIN' : 'USER',
          internalNote: ''
        };
      });
      
      // Sort admins first, then by date (assuming id or joinedAt, but we'll just sort by role for now)
      formatted.sort((a: User, b: User) => {
        if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
        if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
        return 0;
      });

      setUsers(formatted);
    } catch (err) {
      showToast('Lỗi', 'Không thể tải danh sách khách hàng', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { v: 'all', l: 'Tất cả trạng thái' },
    { v: 'active', l: 'Đang hoạt động' },
    { v: 'banned', l: 'Bị khóa' }
  ];

  // Modal State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState('');
  
  // Toast & Confirm
  const [toastMessage, setToastMessage] = useState<{title: string, message: string, type: 'success' | 'error'} | null>(null);
  const [confirmBanId, setConfirmBanId] = useState<string | null>(null);

  const showToast = (title: string, message: string, type: ToastType = 'success') => {
    setToastMessage({ title, message, type });
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        u.phone.includes(q)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(u => u.status === statusFilter);
    }
    
    return result;
  }, [users, searchQuery, statusFilter]);

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;

  const handleOpenModal = (user: User) => {
    setSelectedUser(user);
    setEditingNote(user.internalNote);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await axiosClient.patch(`/users/${id}/toggle-status`);
      setUsers(prev => prev.map(u => {
        if (u.id === id) {
          const newStatus = u.status === 'active' ? 'banned' : 'active';
          showToast(
            newStatus === 'active' ? 'Đã mở khóa' : 'Đã khóa tài khoản', 
            `Tài khoản của ${u.name} đã được ${newStatus === 'active' ? 'kích hoạt lại' : 'vô hiệu hóa'}.`
          );
          
          if (selectedUser?.id === id) {
            setSelectedUser({ ...u, status: newStatus });
          }
          return { ...u, status: newStatus };
        }
        return u;
      }));
    } catch (err: any) {
      showToast('Lỗi', err.response?.data?.detail || 'Không thể cập nhật trạng thái', 'error');
    } finally {
      setConfirmBanId(null);
    }
  };

  const handleSaveNote = () => {
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, internalNote: editingNote } : u));
    setSelectedUser({ ...selectedUser, internalNote: editingNote });
    showToast('Lưu ghi chú thành công', `Đã cập nhật ghi chú cho khách hàng ${selectedUser.name}.`);
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50 relative">
      
      {/* Toast Notification */}
      <Toast toast={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Toast Notification */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Khách hàng</h1>
          <p className="text-[14px] text-slate-500 mt-1">Quản lý thông tin tài khoản người dùng đăng ký hệ thống.</p>
        </div>
        
        {/* Quick Stats */}
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-x divide-slate-100">
          <div className="px-5 py-3">
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tổng cộng</div>
            <div className="text-[22px] font-black text-slate-800 leading-none">{totalUsers}</div>
          </div>
          <div className="px-5 py-3 bg-blue-50/30">
            <div className="text-[12px] font-bold text-[#0084ff] uppercase tracking-wider mb-1.5">Hoạt động</div>
            <div className="text-[22px] font-black text-[#0084ff] leading-none">{activeUsers}</div>
          </div>
          <div className="px-5 py-3 bg-red-50/30">
            <div className="text-[12px] font-bold text-red-500 uppercase tracking-wider mb-1.5">Bị khóa</div>
            <div className="text-[22px] font-black text-red-500 leading-none">{bannedUsers}</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-[14px] focus:outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00] transition-colors"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-[180px]" ref={statusFilterRef}>
            <button 
              onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
              className={`flex items-center justify-between w-full bg-white border border-slate-300 text-slate-700 text-[14px] px-4 py-2 outline-none transition-colors ${isStatusFilterOpen ? 'rounded-t-lg' : 'rounded-lg hover:border-slate-400'}`}
            >
              <span className="font-medium truncate">{statusOptions.find(o => o.v === statusFilter)?.l}</span>
              <Filter className={`w-4 h-4 text-slate-400 shrink-0 transition-colors ${isStatusFilterOpen ? 'text-[#ff5b00]' : ''}`} />
            </button>
            {isStatusFilterOpen && (
              <div className="absolute top-full left-0 w-full bg-white border border-t-0 border-slate-300 rounded-b-lg shadow-lg py-1 z-50">
                {statusOptions.filter(opt => opt.v !== statusFilter).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => {
                      setStatusFilter(opt.v);
                      setIsStatusFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-[14px] text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {(searchQuery || statusFilter !== 'all') && (
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="px-4 py-2 text-[14px] font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[13px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-4 px-6 font-bold w-[60px] text-center">STT</th>
                <th className="py-4 px-6 font-bold w-[280px]">Khách hàng</th>
                <th className="py-4 px-6 font-bold w-[200px]">Liên hệ</th>
                <th className="py-4 px-6 font-bold w-[140px]">Ngày tham gia</th>
                <th className="py-4 px-6 font-bold w-[180px]">Thống kê mua hàng</th>
                <th className="py-4 px-6 font-bold w-[120px] text-center">Trạng thái</th>
                <th className="py-4 px-6 font-bold w-[100px] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-slate-200 border-t-[#ff5b00] rounded-full animate-spin"></div>
                    </div>
                    <p className="mt-4 text-slate-500 text-sm">Đang tải danh sách khách hàng...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <UserCircle className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-[14px]">Không tìm thấy khách hàng nào phù hợp.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6 text-center text-slate-500 font-medium text-[13px]">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#ff5b00]/10 text-[#ff5b00] flex items-center justify-center font-bold text-[16px] shrink-0 uppercase border border-[#ff5b00]/20">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-[15px] text-slate-800 flex items-center gap-2 truncate">
                            {user.name}
                            {user.role === 'ADMIN' && (
                              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">Admin</span>
                            )}
                          </div>
                          <div className="text-[12px] text-slate-500 mt-0.5 truncate" title={user.id}>ID: {user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[13px] text-slate-600">
                      {new Date(user.joinedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <div className="text-[13px] font-bold text-slate-700">{user.totalOrders} đơn hàng</div>
                        <div className="text-[13px] text-[#ff5b00] font-medium">{formatCurrency(user.totalSpent)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[12px] font-bold border ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-1.5 text-slate-400 hover:text-[#0084ff] bg-white hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {confirmBanId === user.id ? (
                          <div className="flex items-center bg-white border border-slate-200 rounded px-2 py-1 gap-2 absolute right-8 z-10 shadow-lg animate-in fade-in zoom-in-95">
                            <span className="text-[12px] font-bold text-slate-700 whitespace-nowrap">
                              {user.status === 'active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
                            </span>
                            <button onClick={() => handleToggleStatus(user.id)} className={`text-[11px] text-white px-2 py-0.5 rounded ${user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                              Có
                            </button>
                            <button onClick={() => setConfirmBanId(null)} className="text-[11px] text-slate-500 hover:text-slate-700">Hủy</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmBanId(user.id)}
                            className={`p-1.5 bg-white rounded transition-colors ${user.status === 'active' ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-red-500 hover:text-emerald-500 hover:bg-emerald-50'}`}
                            title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                          >
                            {user.status === 'active' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                Hồ sơ Khách hàng <span className="text-slate-400 font-normal text-[14px]">#{selectedUser.id}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
              {/* Left Column: Info & Status */}
              <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-6">
                {/* Profile Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col items-center text-center">
                  <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm mb-4" />
                  <h3 className="text-[18px] font-bold text-slate-800 mb-1">{selectedUser.name}</h3>
                  <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[12px] font-bold border mb-4 ${selectedUser.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {selectedUser.status === 'active' ? 'Tài khoản Hoạt động' : 'Tài khoản Bị khóa'}
                  </span>
                  
                  <div className="w-full space-y-3 text-left">
                    <div className="flex items-center gap-3 text-[14px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <Mail className="w-4 h-4 text-slate-400" /> {selectedUser.email}
                    </div>
                    <div className="flex items-center gap-3 text-[14px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <Phone className="w-4 h-4 text-slate-400" /> {selectedUser.phone}
                    </div>
                    <div className="flex items-center gap-3 text-[14px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100">
                      <Calendar className="w-4 h-4 text-slate-400" /> Tham gia: {new Date(selectedUser.joinedAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                {/* Account Action */}
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <h4 className="text-[14px] font-bold text-slate-800 mb-3">Quản lý truy cập</h4>
                  <p className="text-[12px] text-slate-500 mb-4">Khóa tài khoản nếu phát hiện hành vi spam hoặc gian lận. Khách hàng sẽ không thể đăng nhập và mua hàng.</p>
                  
                  <div className="flex items-center gap-3">
                    {selectedUser.status === 'active' ? (
                      <button 
                        onClick={() => handleToggleStatus(selectedUser.id)}
                        className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2 border border-red-100"
                      >
                        <Ban className="w-4 h-4" /> Khóa tài khoản này
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(selectedUser.id)}
                        className="w-full py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-[13px] rounded-lg transition-colors flex items-center justify-center gap-2 border border-emerald-100"
                      >
                        <Check className="w-4 h-4" /> Mở khóa tài khoản
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Stats & Notes */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-[#0084ff] rounded-full flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-slate-500 uppercase">Tổng đơn hàng</div>
                      <div className="text-[20px] font-black text-slate-800 mt-0.5">{selectedUser.totalOrders} <span className="text-[14px] font-medium text-slate-500">đơn</span></div>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-[#ff5b00] rounded-full flex items-center justify-center shrink-0">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-slate-500 uppercase">Tổng chi tiêu</div>
                      <div className="text-[20px] font-black text-slate-800 mt-0.5">{formatCurrency(selectedUser.totalSpent)}</div>
                    </div>
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h4 className="text-[14px] font-bold text-slate-800">Ghi chú nội bộ</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">Chỉ admin mới có thể xem phần ghi chú này.</p>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <textarea 
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      placeholder="Nhập ghi chú về khách hàng (lịch sử bồi thường, thói quen đặt tour, cảnh báo...)"
                      className="w-full flex-1 min-h-[150px] p-3 text-[14px] border border-slate-200 rounded-lg outline-none focus:border-[#0084ff] focus:ring-1 focus:ring-[#0084ff] resize-none transition-colors"
                    ></textarea>
                    
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={handleSaveNote}
                        disabled={editingNote === selectedUser.internalNote}
                        className="px-5 py-2.5 bg-[#0084ff] hover:bg-[#0073e6] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Lưu Ghi Chú
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
