import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { Form, Input, Button, Typography, Alert } from 'antd';

const { Title } = Typography;

const SignUp = () => {
  // Estados para el manejo de entradas de usuario y errores
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Inicializa la autenticación de Firebase
  const auth = getAuth(app);

  // Función para manejar el registro
  const handleSignUp = async (values) => {
    setError('');
    setSuccess('');

    try {
      // Crea un usuario con el email y contraseña proporcionados
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      setSuccess('User successfully registered!');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <Title level={2}>Sign Up</Title>
      <Form onFinish={handleSignUp} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert message={error} type="error" showIcon style={{ marginTop: '1rem' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginTop: '1rem' }} />}
    </div>
  );
};

export default SignUp;