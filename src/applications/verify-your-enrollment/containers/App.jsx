import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationPageWrapper from '../components/EnrollmentVerificationPageWrapper';

export default function App({ children }) {
  return (
    <EnrollmentVerificationPageWrapper>
      {children}
    </EnrollmentVerificationPageWrapper>
  );
}

App.propTypes = {
  children: PropTypes.any,
};
