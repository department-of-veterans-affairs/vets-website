import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import MGIBEnrollmentStatement from '../components/MGIBEnrollmentStatement';
import PeriodsToVerify from '../components/PeriodsToVerify';
import PreviousEnrollmentVerifications from '../components/PreviousEnrollmentVerifications';
import PageLink from '../components/PageLink';
import {
  BENEFITS_PROFILE_RELATIVE_URL,
  BENEFITS_PROFILE_URL,
} from '../constants';
import { getMockData } from '../selectors/mockData';
import { useScrollToTop } from '../hooks/useScrollToTop';
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';
import { useData } from '../hooks/useData';
import MoreInfoCard from '../components/MoreInfoCard';
import NeedHelp from '../components/NeedHelp';

const EnrollmentVerificationPageWrapper = ({ children }) => {
  useScrollToTop();
  const mockData = useSelector(getMockData);
  const { date } = useData();

  return (
    <>
      <div name="topScrollElement" />
      <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <MGIBEnrollmentStatement />
            <PeriodsToVerify />
            <CurrentBenefitsStatus
              updated="12/04/2023"
              remainingBenefits="33 Months, 0 Days"
              expirationDate={date}
              link={() => (
                <PageLink
                  linkText="Manage your benefits profile"
                  relativeURL={BENEFITS_PROFILE_RELATIVE_URL}
                  URL={BENEFITS_PROFILE_URL}
                  color="blue"
                  margin="0"
                />
              )}
            />
            <PreviousEnrollmentVerifications enrollmentData={mockData} />
            <MoreInfoCard marginTop="7" />
            <NeedHelp />
            {children}
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};

EnrollmentVerificationPageWrapper.propTypes = {
  children: PropTypes.any,
};

export default EnrollmentVerificationPageWrapper;
