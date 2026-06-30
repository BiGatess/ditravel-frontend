import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Edit, Trash2, X, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axios';
import Toast, { ToastMessage } from '../../components/admin/Toast';

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  is_featured: boolean;
  published_at: string;
};

const emptyForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author_name: '',
  status: 'DRAFT',
  is_featured: false,
  published_at: '',
};

const toDateInput = (value?: string | null) => value ? new Date(value).toISOString().slice(0, 16) : '';
const fromDateInput = (value: string) => value ? new Date(value).toISOString() : null;

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/blogs/');
      setPosts(res.data || []);
    } catch (error: any) {
      setToast({ title: 'Lỗi tải blog', message: error.response?.data?.detail || 'Không thể tải danh sách bài viết.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(post =>
      post.title?.toLowerCase().includes(q) ||
      post.slug?.toLowerCase().includes(q) ||
      post.author_name?.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const openModal = (post: any = null) => {
    setEditingPost(post);
    setForm(post ? {
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      cover_image: post.cover_image || '',
      author_name: post.author_name || '',
      status: post.status || 'DRAFT',
      is_featured: post.is_featured || false,
      published_at: toDateInput(post.published_at),
    } : emptyForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
  };

  const buildPayload = () => ({
    title: form.title.trim(),
    slug: form.slug.trim() || undefined,
    excerpt: form.excerpt.trim() || null,
    content: form.content.trim() || null,
    cover_image: form.cover_image.trim() || null,
    author_name: form.author_name.trim() || null,
    status: form.status,
    is_featured: form.is_featured,
    published_at: form.status === 'PUBLISHED' ? fromDateInput(form.published_at) : null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setToast({ title: 'Thiếu tiêu đề', message: 'Vui lòng nhập tiêu đề bài viết.', type: 'error' });
      return;
    }

    try {
      const payload = buildPayload();
      if (editingPost) {
        await axiosClient.put(`/blogs/${editingPost.id}`, payload);
      } else {
        await axiosClient.post('/blogs/', payload);
      }
      await fetchPosts();
      closeModal();
      setToast({ title: 'Đã lưu bài viết', message: 'Bài viết đã được đồng bộ với backend.' });
    } catch (error: any) {
      setToast({ title: 'Lỗi lưu blog', message: error.response?.data?.detail || 'Không thể lưu bài viết.', type: 'error' });
    }
  };

  const handleDelete = async (post: any) => {
    if (!window.confirm(`Xóa bài viết "${post.title}"?`)) return;
    try {
      await axiosClient.delete(`/blogs/${post.id}`);
      await fetchPosts();
      setToast({ title: 'Đã xóa bài viết', message: 'Bài viết đã được xóa.', type: 'delete' });
    } catch (error: any) {
      setToast({ title: 'Lỗi xóa blog', message: error.response?.data?.detail || 'Không thể xóa bài viết.', type: 'error' });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-slate-800">Quản lý Blog</h1>
          <p className="text-[13px] text-slate-500 mt-1">Tạo bài viết public cho trang cẩm nang du lịch.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-[#ff5b00] text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#e65200]">
          <Plus className="w-4 h-4" /> Thêm bài viết
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm bài viết..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[14px] outline-none focus:border-[#ff5b00] focus:ring-1 focus:ring-[#ff5b00]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[12px] uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Bài viết</th>
                <th className="px-5 py-3">Tác giả</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Xuất bản</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {isLoading ? (
                <tr><td colSpan={5} className="py-10 text-center text-slate-500">Đang tải bài viết...</td></tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    Chưa có bài viết nào.
                  </td>
                </tr>
              ) : filteredPosts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-800">{post.title}</div>
                    <div className="text-[12px] text-slate-500">/{post.slug}</div>
                  </td>
                  <td className="px-5 py-4">{post.author_name || 'DITRAVEL'}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded text-[12px] font-bold ${post.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-600' : post.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-500' : 'bg-yellow-50 text-yellow-600'}`}>
                      {post.status}
                    </span>
                    {post.is_featured && <span className="ml-2 px-2 py-1 rounded bg-orange-50 text-[#ff5b00] text-[11px] font-bold">Nổi bật</span>}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-600">
                    {post.published_at ? new Date(post.published_at).toLocaleString('vi-VN') : '-'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {post.status === 'PUBLISHED' && <Link to={`/blog/${post.slug}`} className="inline-flex p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Eye className="w-4 h-4" /></Link>}
                    <button onClick={() => openModal(post)} className="p-2 text-slate-400 hover:text-[#0084ff] hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(post)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
          <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800">{editingPost ? 'Sửa bài viết' : 'Thêm bài viết'}</h2>
              <button type="button" onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề" className="md:col-span-2 border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="Slug tùy chọn" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input value={form.author_name} onChange={e => setForm({ ...form, author_name: e.target.value })} placeholder="Tác giả" className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <input value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })} placeholder="URL ảnh bìa" className="md:col-span-2 border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Tóm tắt" className="md:col-span-2 border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] min-h-[80px]" />
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Nội dung bài viết" className="md:col-span-2 border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00] min-h-[220px]" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as BlogForm['status'] })} className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]">
                <option value="DRAFT">DRAFT</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
              <input type="datetime-local" value={form.published_at} onChange={e => setForm({ ...form, published_at: e.target.value })} className="border border-slate-300 rounded-lg p-3 text-[14px] outline-none focus:border-[#ff5b00]" />
              <label className="md:col-span-2 flex items-center gap-2 text-[13px] font-bold text-slate-600">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                Đánh dấu bài viết nổi bật
              </label>
            </div>

            <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-[13px] font-bold">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#ff5b00] text-white text-[13px] font-bold">Lưu bài viết</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
