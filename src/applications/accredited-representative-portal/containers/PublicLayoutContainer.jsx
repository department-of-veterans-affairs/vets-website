import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';

const PublicLayoutContainer = () => {
  return (
    <div className="container">
      <PublicHeader />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayoutContainer;
