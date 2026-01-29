import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

// Mock de NavigationContext
vi.mock('../context/NavigationContext', () => ({
  useNavigation: () => ({
    setView: vi.fn(),
  }),
}));

// Wrapper con contextos necesarios
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component (functional test)', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    vi.clearAllMocks();
  });

  it('debería renderizar el formulario de login correctamente', () => {
    render(
      <AllTheProviders>
        <Login />
      </AllTheProviders>
    );

    // Verificar que los elementos clave estén presentes
    expect(screen.getByText(/bienvenido/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/tu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('debería cambiar entre modo login y registro', async () => {
    const user = userEvent.setup();
    
    render(
      <AllTheProviders>
        <Login />
      </AllTheProviders>
    );

    // Inicialmente debe estar en modo login
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();

    // Cambiar a modo registro
    const registerLink = screen.getByText(/regístrate aquí/i);
    await user.click(registerLink);

    // Ahora debe mostrar el campo de nombre
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    });
  });

  it('debería validar campos vacíos', async () => {
    const user = userEvent.setup();
    
    render(
      <AllTheProviders>
        <Login />
      </AllTheProviders>
    );

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    // El formulario debería prevenir el envío con campos vacíos
    // (esto depende de tu implementación de validación)
  });

  it('debería permitir escribir en los campos de email y password', async () => {
    const user = userEvent.setup();
    
    render(
      <AllTheProviders>
        <Login />
      </AllTheProviders>
    );

    const emailInput = screen.getByPlaceholderText(/tu@email.com/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement;

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123456');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('123456');
  });
});
