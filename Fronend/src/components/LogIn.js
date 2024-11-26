import React, { useState } from 'react';
import { getAuth, fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { Form, Input, Button, Typography, Alert } from 'antd';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LogIn.css';

const { Title } = Typography;

const LogIn = () => {

  const [email, setEmail] = useState('');   // Estado de entrada de usuario para email
  const [error, setError] = useState('');  // Estados para el manejo de errores 
  const [success, setSuccess] = useState('');  // Estados para el manejo de éxito

  const auth = getAuth(app);  // Inicializa la autenticación de Firebase
  const navigate = useNavigate();

  const handleEmailCheck = async (values) => { // Función para manejar el registro de usuarios
    setError('');
    setSuccess('');

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, values.email); // Comprueba si el email ya está registrado
      navigate('/login-password', { state: { email: values.email } });
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
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para manejar el inicio de sesión con GitHub
  /*
  const handleGithubLogin = async () => {
    setError('');
    setSuccess('');
  
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setSuccess('User successfully logged in with GitHub!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  // Función para configurar el reCAPTCHA y manejar el inicio de sesión con número de teléfono
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA verificado');
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expiró. Inténtalo nuevamente.');
          },
        },
        auth
      );
      // Renderizar el reCAPTCHA para que pueda ser utilizado
      window.recaptchaVerifier.render().then(widgetId => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  */

  return ( 
    <div className='login-container'> 
      <Title level={2} className='login-title'>Te damos la bienvenida de nuevo</Title>
      <Form onFinish={ handleEmailCheck} layout='vertical' className='login-form'>
          <Form.Item
            label='Correo electrónico'
            name='email'
            rules={[{ required: true, message: 'Por favor ingresa tu correo electrónico!' }]}
          >
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='login-input'
            />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' block className='login-button'>
              Continuar
            </Button>
          </Form.Item>
      </Form>

      <div className='register-link-container'>
        <span>¿No tiene una cuenta? </span>
        <Link to="/signup" className='register-link'>Registrate</Link>
      </div>

      <div className='divider'>
        <span>o</span>
      </div>

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

      {/*
      <Button
          icon={<GithubOutlined />}
          type="default"
          className="github-login-button"
          block
          onClick={handleGithubLogin}
        >
          Continúa con GitHub
      </Button>
      <div id="recaptcha-container"></div>*/}

      {error && <Alert message={error} type="error" showIcon style={{ marginTop: '1rem' }} />}
      {success && <Alert message={success} type="success" showIcon style={{ marginTop: '1rem' }} />}
    </div>
  );
};

export default LogIn;
