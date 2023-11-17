
export const BACK_URL = 'http://localhost:3000';

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: 'yellow' | 'red' | 'blue';
  }