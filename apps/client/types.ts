
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
}

export interface Review {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  highlight?: boolean;
}

export type ViewState = 'catalog' | 'about' | 'reviews';

export interface CartItem {
  bouquetId: string;
  quantity: number;
}
