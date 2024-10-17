import React, { useState } from 'react';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { Form, Input, Button, Typography, Alert } from 'antd';
import '../styles/LogIn.css';

const { Title } = Typography;

const LogIn = () => {

  const [email, setEmail] = useState('');   // Estado de entrada de usuario para email
  const [error, setError] = useState('');  // Estados para el manejo de errores 
  const [success, setSuccess] = useState('');  // Estados para el manejo de éxito

  const auth = getAuth(app);  // Inicializa la autenticación de Firebase

  const handleEmailCheck = async (values) => { // Función para manejar el registro de usuarios
    setError('');
    setSuccess('');

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, values.email); // Comprueba si el email ya está registrado
      if(signInMethods.length > 0) {
        setSuccess('User already registered!');
      } else {
        setSuccess('Continue with the registration process');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return ( 
    <div className='login-container'> 
      <Title level={2} className='login-title'>Log in or sign up</Title>
      <Form onFinish={handleEmailCheck} layout="vertical" className='login-form'>
        <Form.Item
          label="Email" // Email
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='login-input'
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block className='login-button'>
            Register
          </Button>
        </Form.Item>
      </Form>
      {error && <Alert message={error} type="error" showIcon style={{ marginTop: '1rem' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginTop: '1rem' }} />}
    </div>
  );
};

export default LogIn;