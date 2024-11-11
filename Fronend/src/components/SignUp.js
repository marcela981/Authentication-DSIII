// src/components/SignUp.js
import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'; // Incluye useNavigate
import '../styles/SignUp.css';

const { Title } = Typography;

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || ''); // Obtenemos el correo desde la redirección

  const auth = getAuth(app);
  const navigate = useNavigate(); 

  // Función para manejar el registro
  const handleSignUp = async (values) => {
    setError('');
    setSuccess('');

    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      setSuccess('¡Usuario registrado con éxito!');
      navigate('/'); // Redirige al home después de registrarse
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='signup-container'>
      <Title level={2} className='signup-title'>Regístrate</Title>
      <Form onFinish={handleSignUp} layout="vertical" className='signup-form'>
        <Form.Item
          label="Correo Electrónico"
          name="email"
          initialValue={email}
          rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico!' }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='signup-input'
            disabled
          />
        </Form.Item>
        <Form.Item
          label="Nombre Completo"
          name="fullName"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre completo!' }]}
        >
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className='signup-input'
          />
        </Form.Item>
        <Form.Item
          label="Dirección"
          name="address"
          rules={[{ required: true, message: 'Por favor ingresa tu dirección!' }]}
        >
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='signup-input'
          />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingresa tu contraseña!' }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='signup-input'
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block className='signup-button'>
            Registrarse
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert message={error} type="error" showIcon style={{ marginTop: '1rem' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginTop: '1rem' }} />}
    </div>
  );
};

export default SignUp;
