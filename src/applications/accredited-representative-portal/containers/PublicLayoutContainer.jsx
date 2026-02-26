import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '~/platform/site-wide/representative/components/footer/Footer';
import PublicHeader from '../components/PublicHeader';
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
