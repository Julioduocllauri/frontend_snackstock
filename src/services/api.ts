import axios from 'axios';
// @ts-ignore
import Tesseract from 'tesseract.js';

// Define la forma de tus productos
export interface Product {
  id?: number;
  name: string;
  quantity: number;
  expiry_date?: string;
  category?: string;
  status: 'green' | 'yellow' | 'red';
  days_left: number;
}

// Apunta a tu backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Obtener userId desde localStorage
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

// 1. Obtener productos
export const getPantryItems = async (): Promise<Product[]> => {
  try {
    const userId = getUserId();
    if (!userId) {
      console.warn('No hay usuario autenticado');
      return [];
    }
    
    const response = await api.get('/inventory', {
      params: { userId }
    });
    
    // El backend devuelve { success: true, data: [...] }
    if (response.data.success && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error("Error conectando al backend:", error);
    return [];
  }
};

// 2. Procesar Boleta
export const processReceipt = async (file: File) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }
  
  // @ts-ignore
  const { data: { text } } = await Tesseract.recognize(file, 'spa');
  
  const response = await api.post('/process-receipt', { 
    rawText: text,
    userId 
  });
  return response.data;
};

// 3. Generar Receta
export const generateRecipeAI = async (ingredients: string | string[], count: number = 3) => {
  const ingredientsArray = Array.isArray(ingredients) ? ingredients : [ingredients];
  const response = await api.post('/generate-recipe', { ingredients: ingredientsArray, count });
  // Backend returns { success: true, data: [...recipes] }
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  return response.data;
};

// 4. Actualizar producto
export const updateProduct = async (id: number, updates: Partial<Product>) => {
  const response = await api.put(`/inventory/${id}`, updates);
  return response.data;
};

// 5. Eliminar producto
export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};

// 6. Crear producto
export const createProduct = async (product: Partial<Product>) => {
  const userId = getUserId();
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }
  
  const response = await api.post('/inventory', {
    ...product,
    user_id: userId
  });
  return response.data;
};