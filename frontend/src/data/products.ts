export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;

  origin: string[];
  flavor: string[];
  caffeine: string;

  organic: boolean;
  vegan: boolean;

  image: string;

  allergens: string[];
  qualities: string[];
  ingredients: string;

  brewing: {
    servingSize: string;
    waterTemp: string;
    steepingTime: string;
    colorAfter3Min: string;
  };

  variants: Array<{
    id: string;
    weight: string;
    price: number;
    stock: number;
  }>;

  price: number;

  createdAt?: string;
  updatedAt?: string;
}
