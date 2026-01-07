import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import ArpMaintenanceWindowBanner from '../components/ArpMaintenanceWindowBanner';

const PublicLayoutContainer = () => {
  return (
    <div className="container">
      <PublicHeader />
      <ArpMaintenanceWindowBanner />
      <Outlet />
      <Footer />
    </div>
  );
};

export default PublicLayoutContainer;
