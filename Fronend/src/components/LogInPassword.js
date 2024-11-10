// src/components/LogInPassword.js
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig'; 
import { Form, Input, Button, Typography, Alert } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/LogInPassword.css';

const { Title } = Typography;

const LogInPassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const auth = getAuth(app);

  const handleSignIn = async () => {
    setError('');
    setSuccess('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Inicio de sesión exitoso!');
      navigate('/'); // Redirigir al home
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='login-password-container'>
      <Title level={2} className='login-title'>Ingresa tu contraseña</Title>
      <Form onFinish={handleSignIn} layout='vertical' className='login-form'>
        <Form.Item
          label='Correo electrónico'
          name='email'
          initialValue={email}
        >
          <Input
            type='email'
            value={email}
            className='login-input'
            disabled
          />
        </Form.Item>
        <Form.Item
          label='Contraseña'
          name='password'
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='login-input'
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' block className='login-button'>
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert message={error} type='error' showIcon style={{ marginTop: '1rem' }} />}
      {success && <Alert message={success} type='success' showIcon style={{ marginTop: '1rem' }} />}
    </div>
  );
};

export default LogInPassword;
