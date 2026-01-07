import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileProvider from '../context/ProfileProvider';
import ArpMaintenanceWindowBanner from '../components/ArpMaintenanceWindowBanner';

const AuthenticatedLayoutContainer = () => {
  useLoaderData();

  return (
    <div className="container">
      <Header />
      <ArpMaintenanceWindowBanner />
      <ProfileProvider>
        <Outlet />
      </ProfileProvider>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayoutContainer;
