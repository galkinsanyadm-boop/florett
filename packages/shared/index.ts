export type Category = 'all' | 'date' | 'birthday' | 'wedding' | 'just-because';

export interface Bouquet {
  id: string;
  name: string;
  price: number;
  category: Category;
  images: string[];
  description: string;
  composition: string[];
  size: string;
  isActive?: boolean;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  highlight?: boolean;
  isApproved?: boolean;
}

export type OrderStatus = 'new' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  bouquetId: string;
  quantity: number;
  priceAtOrder: number;
  bouquet?: Bouquet;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  comment?: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
  createdAt: string;
}

export interface AnalyticsSummary {
  ordersToday: number;
  monthRevenue: number;
  pendingReviews: number;
  newOrders: number;
  totalOrders: number;
  totalBouquets: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface PopularBouquet {
  bouquetId: string;
  name: string;
  totalSold: number;
  image: string | null;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  in_progress: 'В работе',
  delivered: 'Доставлен',
  cancelled: 'Отменён'
};

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'Все букеты',
  date: 'На свидание',
  birthday: 'День рождения',
  wedding: 'Свадьба',
  'just-because': 'Без повода'
};
