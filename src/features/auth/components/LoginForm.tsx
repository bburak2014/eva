import React, { FormEvent, useState } from 'react';
import { useLoginMutation } from '../api/authApi';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('homework@eva.guru');
  const [password, setPassword] = useState('Homeworkeva1**');
  const [login, { isLoading, error, data }] = useLoginMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      console.log('Login successful:', result);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {JSON.stringify(error)}</p>}
      {data && (
        <p style={{ color: 'green' }}>
          Login successful: {JSON.stringify(data, null, 2)}        </p>
      )}
    </div>
  );
};

export default LoginForm;
