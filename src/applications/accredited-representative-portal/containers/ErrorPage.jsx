import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ErrorPage = ({ children }) => {
  return (
    <div className="container">
      <Header />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row">
          <div className="vads-l-col--12 vads-u-padding-y--5">{children}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ErrorPage;
