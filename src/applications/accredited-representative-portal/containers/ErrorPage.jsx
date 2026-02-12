import React from 'react';
import PropTypes from 'prop-types';
import Footer from '~/platform/site-wide/representative/components/footer/Footer';
import ErrorHeader from '../components/Error/ErrorHeader';

const ErrorPage = ({ children }) => {
  return (
    <div className="container">
      <ErrorHeader />
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

ErrorPage.propTypes = {
  children: PropTypes.node,
};
