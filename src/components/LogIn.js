import React, { useState } from 'react';
import { getAuth, fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { Form, Input, Button, Typography, Alert } from 'antd';
import { GoogleOutlined, GithubOutlined, PhoneOutlined } from '@ant-design/icons';
import '../styles/LogIn.css';

const { Title } = Typography;

const LogIn = () => {

  const [email, setEmail] = useState('');   // Estado de entrada de usuario para email
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [error, setError] = useState('');  // Estados para el manejo de errores 
  const [success, setSuccess] = useState('');  // Estados para el manejo de éxito
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

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

  // Función para manejar el inicio de sesión con Google
  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
  
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess('User successfully logged in with Google!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para manejar el inicio de sesión con GitHub
  const handleGithubLogin = async () => {
    setError('');
    setSuccess('');
  
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess('User successfully logged in with GitHub!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para configurar el reCAPTCHA y manejar el inicio de sesión con número de teléfono
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        console.log('reCAPTCHA verified');
      }
    }, auth);
  };
  
  const handlePhoneLogin = async (phoneNumber) => {
    setError('');
    setSuccess('');
  
    setupRecaptcha();
    try {
      const appVerifier = window.recaptchaVerifier;
      await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setSuccess('Verification code sent!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Alternar entre la vista de email y la vista de teléfono
  const toggleView = () => {
    setShowEmail((prev) => !prev);
    setError('');
    setSuccess('');
  };

  return ( 
    <div className='login-container'> 
      <Title level={2} className='login-title'>Log in or sign up</Title>
      <Form onFinish={showEmail ? handleEmailCheck : handlePhoneLogin} layout='vertical' className='login-form'>
        {showEmail ? (
          <Form.Item
            label='Correo electrónico'
            name='email'
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='login-input'
            />
          </Form.Item>
        ) : (
          <Form.Item
            label='Número de teléfono'
            name='phoneNumber'
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input
              type='tel'
              placeholder='+57 300 123 4567'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className='login-input'
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button type='primary' htmlType='submit' block className='login-button'>
            Continuar
          </Button>
        </Form.Item>
        <Button type='link' onClick={toggleView} block className='toggle-button'>
          {showEmail ? 'Continúa con un teléfono' : 'Continúa con un correo electrónico'}
        </Button>
      </Form>

      {/* Botón para iniciar sesión con Google */}
      <Button
          icon={<GoogleOutlined />}
          type="default"
          className='google-login-button'
          block
          onClick={handleGoogleLogin}
        >
          Continúa con Google
        </Button>

        {/* Botón para iniciar sesión con GitHub */}
        <Button
          icon={<GithubOutlined />}
          type="default"
          className="github-login-button"
          block
          onClick={handleGithubLogin}
        >
          Continúa con GitHub
        </Button>
        <div id="recaptcha-container"></div>

      {error && <Alert message={error} type="error" showIcon style={{ marginTop: '1rem' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginTop: '1rem' }} />}
    </div>
  );
};

export default LogIn;