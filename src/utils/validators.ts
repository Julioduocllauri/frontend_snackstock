/**
 * Valida el formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida la fortaleza de la contraseña
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) {
    return { valid: false, message: 'La contraseña es obligatoria' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }

  return { valid: true };
}

/**
 * Calcula los días restantes hasta la fecha de vencimiento
 */
export function getDaysLeft(expiryDate: string | Date): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const timeDiff = expiry.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Obtiene el estado de un producto según días restantes
 */
export function getProductStatus(daysLeft: number): 'green' | 'yellow' | 'red' {
  if (daysLeft <= 3) return 'red';
  if (daysLeft <= 7) return 'yellow';
  return 'green';
}

/**
 * Formatea un precio
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(price);
}
