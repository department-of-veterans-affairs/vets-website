import React from 'react';
import PropTypes from 'prop-types';
import EnrollmentVerificationPageWrapper from './EnrollmentVerificationPageWrapper';

import BenefitsProfileWrapper from './BenefitsProfilePageWrapper';

export default function App({ children }) {
  return (
    <>
      <EnrollmentVerificationPageWrapper>
        {children}
      </EnrollmentVerificationPageWrapper>
      <BenefitsProfileWrapper>{children}</BenefitsProfileWrapper>
    </>
  );
}

App.propTypes = {
  children: PropTypes.any,
};
