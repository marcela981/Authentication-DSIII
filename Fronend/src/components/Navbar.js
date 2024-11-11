import react from 'react';
import {Menu, Space} from 'antd';
import {UserOutlined, GlobalOutlined} from '@ant-design/icons';
import '../styles/Navbar.css';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className='navbar-logo'>
                <img
                src='/images/casa-de-hotel-rural-con-forma-de-hoja.png'
                alt='logo'
                className='navbar-logo-img'
                />
            </div>
            <Space className='navbar-items'>
                <span className='navbar-text'>Home</span>
                <GlobalOutlined className="navbar-icon" />
                <UserOutlined className="navbar-icon" />
            </Space>
        </div>
    );
};

export default Navbar;