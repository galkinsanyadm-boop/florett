import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, X, Phone, MapPin, Calendar, Clock, MessageSquare } from 'lucide-react';
import { fetchOrders, fetchOrder, updateOrderStatus } from '@/lib/api';
import { formatPrice, formatDateTime, cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  in_progress: 'В работе',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const statusOrder = ['new', 'confirmed', 'in_progress', 'delivered', 'cancelled'];

export function OrdersPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', filterStatus],
    queryFn: () => fetchOrders(filterStatus !== 'all' ? { status: filterStatus } : undefined),
  });

  const { data: selectedOrder, isLoading: orderLoading } = useQuery({
    queryKey: ['order', selectedOrderId],
    queryFn: () => fetchOrder(selectedOrderId!),
    enabled: !!selectedOrderId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', selectedOrderId] });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
          <p className="text-gray-500 mt-1">Управление заказами клиентов</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition',
            filterStatus === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          )}
        >
          Все
        </button>
        {statusOrder.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition',
              filterStatus === status ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            )}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Загрузка...</div>
      ) : (orders as any[])?.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-gray-100">
          Нет заказов
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Клиент</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Телефон</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Сумма</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Дата</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody>
              {(orders as any[])?.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-gray-600">{order.customerPhone}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.totalPrice)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer',
                        statusColors[order.status]
                      )}
                    >
                      {statusOrder.map((s) => (
                        <option key={s} value={s}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{formatDateTime(order.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedOrderId(order.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                      title="Подробнее"
                    >
                      <Eye size={18} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Заказ #{selectedOrderId.slice(0, 8)}</h2>
              <button onClick={() => setSelectedOrderId(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            {orderLoading ? (
              <div className="p-6 text-center text-gray-400">Загрузка...</div>
            ) : selectedOrder ? (
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Клиент</p>
                      <p className="font-medium text-gray-900">{(selectedOrder as any).customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-medium text-gray-900">{(selectedOrder as any).customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Адрес доставки</p>
                      <p className="text-gray-900">{(selectedOrder as any).deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-gray-400" />
                      <span className="text-gray-900">{(selectedOrder as any).deliveryDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} className="text-gray-400" />
                      <span className="text-gray-900">{(selectedOrder as any).deliveryTime}</span>
                    </div>
                  </div>
                  {(selectedOrder as any).comment && (
                    <div className="flex items-start gap-3">
                      <MessageSquare size={18} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Комментарий</p>
                        <p className="text-gray-900">{(selectedOrder as any).comment}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Состав заказа</h3>
                  <div className="space-y-3">
                    {(selectedOrder as any).items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        {item.bouquet?.images?.[0] && (
                          <img
                            src={item.bouquet.images[0]}
                            alt={item.bouquet.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.bouquet?.name || 'Букет удалён'}</p>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.priceAtOrder)} x {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(item.priceAtOrder * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg text-gray-600">Итого:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice((selectedOrder as any).totalPrice)}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-600">Статус:</span>
                  <select
                    value={(selectedOrder as any).status}
                    onChange={(e) => handleStatusChange(selectedOrderId, e.target.value)}
                    className={cn(
                      'px-4 py-2 rounded-lg font-medium border-0 cursor-pointer',
                      statusColors[(selectedOrder as any).status]
                    )}
                  >
                    {statusOrder.map((s) => (
                      <option key={s} value={s}>{statusLabels[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
