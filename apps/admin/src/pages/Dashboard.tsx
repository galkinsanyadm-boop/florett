import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, DollarSign, MessageSquare, Package, TrendingUp, Flower2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchAnalyticsSummary, fetchRevenueData, fetchOrders } from '@/lib/api';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

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

export function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: fetchAnalyticsSummary,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['analytics-revenue'],
    queryFn: () => fetchRevenueData(14),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders-recent'],
    queryFn: () => fetchOrders(),
  });

  const recentOrders = (orders as any[])?.slice(0, 5) || [];

  const cards = [
    {
      label: 'Заказы сегодня',
      value: summary?.ordersToday ?? 0,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      label: 'Выручка за месяц',
      value: formatPrice(summary?.monthRevenue ?? 0),
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'На модерации',
      value: summary?.pendingReviews ?? 0,
      icon: MessageSquare,
      color: 'bg-yellow-500',
    },
    {
      label: 'Новые заказы',
      value: summary?.newOrders ?? 0,
      icon: Package,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-500 mt-1">Обзор магазина Florett</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {summaryLoading ? '...' : card.value}
                  </p>
                </div>
                <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', card.color)}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Выручка за 14 дней</h2>
          </div>

          {revenueLoading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              Загрузка...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData as any[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => new Date(val).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  fontSize={12}
                  stroke="#9ca3af"
                />
                <YAxis
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  fontSize={12}
                  stroke="#9ca3af"
                />
                <Tooltip
                  formatter={(value: number) => [formatPrice(value), 'Выручка']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('ru-RU')}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a18072"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">Последние заказы</h2>
          </div>

          {ordersLoading ? (
            <div className="text-center text-gray-400 py-8">Загрузка...</div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center text-gray-400 py-8">Нет заказов</div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(order.totalPrice)}</p>
                    <span className={cn('text-xs px-2 py-1 rounded-full', statusColors[order.status])}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
