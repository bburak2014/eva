// src/features/auth/components/tests/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/features/auth/components/LoginForm';

// Mock dış bağımlılıklar
jest.mock('@/features/auth/api/authApi', () => ({
  useLoginMutation: jest.fn(),
}));

jest.mock('@/shared/utils/toastManager', () => ({
  toastManager: {
    showToast: jest.fn(),
  },
}));

jest.mock('@/shared/utils/localStorageManager', () => ({
  set: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useLoginMutation } from '@/features/auth/api/authApi';
import { toastManager } from '@/shared/utils/toastManager';
import localStorageManager from '@/shared/utils/localStorageManager';
import { useNavigate } from 'react-router-dom';

describe('LoginForm Component Testleri', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Form alanları render ediliyor', () => {
    // useLoginMutation için varsayılan bir mock fonksiyon döndürüyoruz.
    (useLoginMutation as jest.Mock).mockReturnValue([jest.fn()]);
    render(<LoginForm />);

    expect(screen.getByLabelText(/E-mail Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('Başarılı login senaryosu', async () => {
    // Başarılı login durumunu simüle eden mock fonksiyonu tanımlıyoruz.
    const mockLogin = jest.fn().mockResolvedValue({
      unwrap: () => Promise.resolve({ ApiStatus: true, ApiStatusCode: 200 }),
    });
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin]);

    // useNavigate mock fonksiyonunu ayarlıyoruz.
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(<LoginForm />);

    // Submit butonuna tıklıyoruz.
    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    // async işlemlerin tamamlanmasını bekliyoruz.
    await waitFor(() => expect(mockLogin).toHaveBeenCalled());

    // Başarılı login sonrası çağrılan işlemleri kontrol ediyoruz.
    expect(toastManager.showToast).toHaveBeenCalledWith('Login successful!', 'success', 3000);
    expect(localStorageManager.set).toHaveBeenCalledWith('email', 'homework@eva.guru');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('Login başarısız olduğunda hata mesajı gösteriliyor (başarısız sonuç)', async () => {
    // Başarısız login sonucu dönen mock fonksiyonu ayarlıyoruz.
    const mockLogin = jest.fn().mockResolvedValue({
      unwrap: () => Promise.resolve({ ApiStatus: false, ApiStatusCode: 400 }),
    });
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin]);

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockLogin).toHaveBeenCalled());

    expect(toastManager.showToast).toHaveBeenCalledWith('Login failed!', 'error', 3000);
  });

  test('Login işlemi sırasında hata fırlatıldığında hata mesajı gösteriliyor', async () => {
    // Hata fırlatılacak şekilde mock fonksiyonu ayarlıyoruz.
    const mockLogin = jest.fn().mockRejectedValue(new Error('Login error'));
    (useLoginMutation as jest.Mock).mockReturnValue([mockLogin]);

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockLogin).toHaveBeenCalled());

    expect(toastManager.showToast).toHaveBeenCalledWith('Login failed!', 'error', 3000);
  });
});
