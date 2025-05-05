import React from 'react';
import { Outlet, useLoaderData } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AuthenticatedLayoutContainer = () => {
  useLoaderData();

  return (
    <div className="container">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default AuthenticatedLayoutContainer;
