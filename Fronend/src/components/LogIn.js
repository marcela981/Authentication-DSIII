import React, { useState } from 'react';
import { getAuth, fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithPopup, GithubAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '../firebase/firebaseConfig'; // Asegúrate de tener configurado Firebase
import { Form, Input, Button, Typography, Alert } from 'antd';
import { GoogleOutlined, GithubOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/LogIn.css';

const { Title } = Typography;

const LogIn = () => {

  const [email, setEmail] = useState('');   // Estado de entrada de usuario para email
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(''); 
  const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [error, setError] = useState('');  // Estados para el manejo de errores 
  const [success, setSuccess] = useState('');  // Estados para el manejo de éxito
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  const auth = getAuth(app);  // Inicializa la autenticación de Firebase
  const navigate = useNavigate();

  const handleEmailCheck = async (values) => { // Función para manejar el registro de usuarios
    setError('');
    setSuccess('');

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, values.email); // Comprueba si el email ya está registrado
      if(signInMethods.length > 0) {
        setSuccess('User already registered!');
        setShowPasswordInput(true);
      } else {
        setSuccess('Continue with the registration process');
        navigate('/signup', { state: { email: values.email } });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    setError('');
    setSuccess('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Inicio de sesión exitoso!');
      navigate('/'); 
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

  const handlePhoneLogin = async () => {
    setError('');
    setSuccess('');
  
    setupRecaptcha(); // Configurar el reCAPTCHA
  
    try {
      const appVerifier = window.recaptchaVerifier;
  
      // Intentar iniciar sesión con el número de teléfono ingresado
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setShowVerificationCodeInput(true);
      setSuccess('Código de verificación enviado al número proporcionado.');
    } catch (err) {
      setError(err.message);
      // Reiniciar el reCAPTCHA en caso de error para que el usuario pueda intentarlo nuevamente
      if (window.recaptchaWidgetId) {
        grecaptcha.reset(window.recaptchaWidgetId);
      }
    }
  };
  // Verificar el código ingresado por el usuario
  const verifyCode = async () => {
    setError('');
    setSuccess('');

    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(verificationCode);
      setSuccess('Número de teléfono verificado correctamente.');
      navigate('/');
    } catch (err) {
      setError('Código de verificación incorrecto. Inténtalo de nuevo.');
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
      <Title level={2} className='login-title'>Iniciar sesión o registrarse</Title>
      <Form onFinish={showPasswordInput ? handleSignIn : handleEmailCheck} layout='vertical' className='login-form'>
        {showEmail ? (
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
              disabled={showPasswordInput}
            />
          </Form.Item>
        ) : showVerificationCodeInput ? (
          <Form.Item
            label='Código de verificación'
            name='verificationCode'
            rules={[{ required: true, message: 'Por favor ingresa el código de verificación!' }]}
          >
            <Input
              type='text'
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className='login-input'
            />
            <Button type='primary' onClick={verifyCode} block className='login-button' style={{ marginTop: '1rem' }}>
              Verificar Código
            </Button>
          </Form.Item>
        ) : (
          <Form.Item
            label='Número de teléfono'
            name='phoneNumber'
            rules={[{ required: true, message: 'Por favor ingresa tu número de teléfono!' }]}
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
        {!showVerificationCodeInput && (
          <Form.Item>
            <Button type='primary' htmlType='submit' block className='login-button'>
              {showPasswordInput ? 'Iniciar Sesión' : 'Continuar'}
            </Button>
          </Form.Item>
        )}
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
