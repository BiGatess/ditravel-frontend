export interface Product {
  id: string;
  name: string;
  category: string;
  city: string;
  type: string; // 'tour' | 'ticket' | 'show'
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
}

export interface City {
  id: string;
  name: string;
  image: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
}
