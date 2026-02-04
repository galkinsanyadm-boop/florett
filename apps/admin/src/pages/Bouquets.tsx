import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';
import { fetchBouquets, createBouquet, updateBouquet, deleteBouquet } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';

const categoryLabels: Record<string, string> = {
  date: 'На свидание',
  birthday: 'День рождения',
  wedding: 'Свадьба',
  'just-because': 'Без повода',
};

interface BouquetForm {
  name: string;
  price: string;
  category: string;
  description: string;
  composition: string;
  images: string;
  size: string;
  isActive: boolean;
}

const emptyForm: BouquetForm = {
  name: '',
  price: '',
  category: 'date',
  description: '',
  composition: '',
  images: '',
  size: '',
  isActive: true,
};

export function BouquetsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<BouquetForm>(emptyForm);

  const { data: bouquets, isLoading } = useQuery({
    queryKey: ['bouquets'],
    queryFn: fetchBouquets,
  });

  const createMutation = useMutation({
    mutationFn: createBouquet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bouquets'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateBouquet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bouquets'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBouquet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bouquets'] });
    },
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (bouquet: any) => {
    setEditingId(bouquet.id);
    setForm({
      name: bouquet.name,
      price: String(bouquet.price),
      category: bouquet.category,
      description: bouquet.description,
      composition: bouquet.composition.join(', '),
      images: bouquet.images.join('\n'),
      size: bouquet.size,
      isActive: bouquet.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      composition: form.composition.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      size: form.size,
      isActive: form.isActive,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleToggleActive = (bouquet: any) => {
    updateMutation.mutate({
      id: bouquet.id,
      data: { ...bouquet, isActive: !bouquet.isActive },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить этот букет?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Букеты</h1>
          <p className="text-gray-500 mt-1">Управление каталогом</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          Добавить букет
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Загрузка...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Фото</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Название</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Цена</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Категория</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody>
              {(bouquets as any[])?.map((bouquet) => (
                <tr key={bouquet.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={bouquet.images[0]}
                      alt={bouquet.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{bouquet.name}</td>
                  <td className="px-6 py-4 text-gray-600">{formatPrice(bouquet.price)}</td>
                  <td className="px-6 py-4 text-gray-600">{categoryLabels[bouquet.category]}</td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        bouquet.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {bouquet.isActive ? 'Активен' : 'Скрыт'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(bouquet)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title={bouquet.isActive ? 'Скрыть' : 'Показать'}
                      >
                        {bouquet.isActive ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                      </button>
                      <button
                        onClick={() => openEditModal(bouquet)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Редактировать"
                      >
                        <Pencil size={18} className="text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(bouquet.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                        title="Удалить"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingId ? 'Редактировать букет' : 'Новый букет'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Цена (руб.)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Размер</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="35 x 40 см"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Состав (через запятую)</label>
                <input
                  type="text"
                  value={form.composition}
                  onChange={(e) => setForm({ ...form, composition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Розы, Эустома, Эвкалипт"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL изображений (по одному на строку)</label>
                <textarea
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none font-mono text-sm"
                  rows={3}
                  placeholder="https://example.com/image1.jpg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">Показывать в каталоге</label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {editingId ? 'Сохранить' : 'Создать'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
