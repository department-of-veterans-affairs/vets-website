import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileProvider from '../context/ProfileProvider';

const AuthenticatedLayoutContainer = () => {
  useLoaderData();

  return (
    <div className="container">
      <Header />
      <ProfileProvider>
        <Outlet />
      </ProfileProvider>
      <Footer />
    </div>
  );
};

export default AuthenticatedLayoutContainer;
