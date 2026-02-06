import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Footer from '~/platform/site-wide/representative/components/footer/Footer';
import Header from '~/platform/site-wide/representative/components/header/Header';

import ProfileProvider from '../context/ProfileProvider';
import ArpMaintenanceWindowBanner from '../components/ArpMaintenanceWindowBanner';

const AuthenticatedLayoutContainer = () => {
  useLoaderData();
  const profile = useLoaderData();

  return (
    <div className="container">
      <Header {...profile} />
      <ArpMaintenanceWindowBanner />
      <ProfileProvider>
        <Outlet />
      </ProfileProvider>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayoutContainer;
