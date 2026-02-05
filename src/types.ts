
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
  id?: number;
  title: string;
  ingredients: string[];
  instructions: string[] | string;
  prepTime?: string;
  time?: string;
  mainIngredient?: string;
  servings?: number;
  difficulty?: string;
  saved?: boolean;
}
