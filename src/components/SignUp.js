import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { Form, Input, Button, Typography, Alert } from 'antd';
import '../styles/SignUp.css';

const { Title } = Typography;

const SignUp = () => {

  const [email, setEmail] = useState('');   // Estado de entrada de usuario para email
  const [password, setPassword] = useState(''); // Estados de entrada de usuario para contraseña
  const [error, setError] = useState('');  // Estados para el manejo de errores 
  const [success, setSuccess] = useState('');  // Estados para el manejo de éxito

  const auth = getAuth(app);  // Inicializa la autenticación de Firebase

  const handleSignUp = async (values) => { // Función para manejar el registro de usuarios
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
    <div className='signup-container'> 
      <Title level={2} className='signup-title'>Log in or sign up</Title>
      <Form onFinish={handleSignUp} layout="vertical" className='signup-form'>
        <Form.Item
          label="Email" // Email
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='signup-input'
          />
        </Form.Item>
        <Form.Item
          label="Password" // Password
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]} 
        >
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='signup-input' 
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block className='signup-button'>
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