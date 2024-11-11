// src/components/Home.js
import React from 'react';
import { Typography, Button } from 'antd';
import '../styles/Home.css';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div className="home-container">
      <Title level={2} className="home-title">
        Bienvenido a nuestra aplicación
      </Title>
      <Paragraph className="home-description">
        Esta es la página principal de nuestra aplicación. Aquí podrás encontrar información relevante y acceder a las funcionalidades de la plataforma.
      </Paragraph>
      <Button type="primary" className="explore-button">
        Explorar
      </Button>
    </div>
  );
};

export default Home;
