import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import EnrollmentVerificationPageWrapper from './EnrollmentVerificationPageWrapper';
import MGIBEnrollmentStatement from '../components/MGIBEnrollmentStatement';
import PeriodsToVerify from '../components/PeriodsToVerify';
import PreviousEnrollmentVerifications from '../components/PreviousEnrollmentVerifications';
import { getMockData } from '../selectors/mockData';

export default function App({ children }) {
  const mockData = useSelector(getMockData);
  return (
    <EnrollmentVerificationPageWrapper>
      <MGIBEnrollmentStatement />
      <PeriodsToVerify />
      {/* will use this when benefits page is built */}
      {/* <a className="vads-c-action-link--green" href="#"> */}
      <button className="vads-c-action-link--green">
        Manage your benefits profile
        {/* </a> */}
      </button>
      <PreviousEnrollmentVerifications enrollmentData={mockData} />
      {children}
    </EnrollmentVerificationPageWrapper>
  );
}

App.propTypes = {
  children: PropTypes.any,
};
