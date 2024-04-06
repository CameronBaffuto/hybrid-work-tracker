import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-xl">Page Not Found</p>
        <a href="/" className="text-lg hover:underline">Go Home</a>
      </div>
    </div>
  );
};

export default NotFoundPage;
