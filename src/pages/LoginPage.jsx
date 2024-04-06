import React from 'react';
import { LoginForm } from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-fit bg-center" style={{ backgroundImage: "url('/dualdeskBG.png')" }}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
