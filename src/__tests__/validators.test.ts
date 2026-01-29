import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  validatePassword,
  getDaysLeft,
  getProductStatus,
  formatPrice,
} from '../utils/validators';

describe('Validators (unit tests)', () => {
  describe('isValidEmail', () => {
    it('debería retornar true para emails válidos', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
    });

    it('debería retornar false para emails inválidos', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('debería retornar válido para contraseña correcta', () => {
      const result = validatePassword('123456');
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('debería retornar error si es muy corta', () => {
      const result = validatePassword('123');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('La contraseña debe tener al menos 6 caracteres');
    });

    it('debería retornar error si está vacía', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('La contraseña es obligatoria');
    });
  });

  describe('getDaysLeft', () => {
    it('debería calcular días restantes correctamente', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const daysLeft = getDaysLeft(futureDate);
      expect(daysLeft).toBe(5);
    });
  });

  describe('getProductStatus', () => {
    it('debería retornar "red" si quedan 3 días o menos', () => {
      expect(getProductStatus(3)).toBe('red');
      expect(getProductStatus(1)).toBe('red');
    });

    it('debería retornar "yellow" si quedan entre 4 y 7 días', () => {
      expect(getProductStatus(5)).toBe('yellow');
      expect(getProductStatus(7)).toBe('yellow');
    });

    it('debería retornar "green" si quedan más de 7 días', () => {
      expect(getProductStatus(10)).toBe('green');
      expect(getProductStatus(30)).toBe('green');
    });
  });

  describe('formatPrice', () => {
    it('debería formatear precio en pesos chilenos', () => {
      const formatted = formatPrice(1000);
      expect(formatted).toContain('1');
      expect(formatted).toContain('000');
    });
  });
});
