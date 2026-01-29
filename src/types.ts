
export enum ExpiryStatus {
  GOOD = 'Óptimo',
  WARNING = 'Próximo a vencer',
  CRITICAL = 'Crítico'
}

export interface Product {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  status: ExpiryStatus;
  quantity: string;
}

export interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
}
