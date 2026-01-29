import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getUserId = (): string => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    return user.id;
  }
  return '';
};

const api = axios.create({
  baseURL: API_URL,
});

export interface Statistics {
  user: {
    name: string;
    email: string;
    days_in_app: number;
    total_added: number;
    total_consumed: number;
    total_wasted: number;
  };
  inventory: {
    total_products: number;
    critical_products: number;
    waste_rate: number;
  };
  calories: {
    today: number;
    week: number;
    month: number;
    daily_average: number;
  };
  top_consumed: Array<{
    name: string;
    category: string;
    times_consumed: number;
    total_calories: number;
    consumption_rate: number;
    trend: string;
  }>;
  least_consumed: Array<{
    product_name: string;
    category: string;
    times_consumed: number;
    consumption_rate: number;
    trend: string;
  }>;
  wasted_products: Array<{
    name: string;
    category: string;
    times_wasted: number;
  }>;
  recommendations: Array<{
    type: string;
    message: string;
  }>;
}

export const getStatistics = async (): Promise<Statistics> => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }
  
  const response = await api.get('/statistics', {
    params: { userId }
  });
  
  return response.data.data;
};

export const recordConsumption = async (
  productName: string,
  category: string,
  action: 'consumed' | 'wasted',
  quantity?: number,
  calories?: number
) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }
  
  const response = await api.post('/statistics/consumption', {
    userId,
    productName,
    category,
    quantity,
    calories,
    action
  });
  
  return response.data;
};
