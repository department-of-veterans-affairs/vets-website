import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getToggleEnrollmentSuccess } from '../selectors/getToggleEnrollmentSuccess';
// import { getToggleEnrollmentError } from '../selectors/getToggleEnrollmentError';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import MGIBEnrollmentStatement from '../components/MGIBEnrollmentStatement';
import PreviousEnrollmentVerifications from '../components/PreviousEnrollmentVerifications';
import PageLink from '../components/PageLink';
import {
  BENEFITS_PROFILE_RELATIVE_URL,
  BENEFITS_PROFILE_URL,
  VERIFICATION_REVIEW_RELATIVE_URL,
  VERIFICATION_REVIEW_URL,
} from '../constants';
import { getMockData } from '../selectors/mockData';
import { useScrollToTop } from '../hooks/useScrollToTop';
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';
import { useData } from '../hooks/useData';
import MoreInfoCard from '../components/MoreInfoCard';
import NeedHelp from '../components/NeedHelp';
import Loader from '../components/Loader';
import PeriodsToVerify from '../components/PeriodsToVerify';

const EnrollmentVerificationPageWrapper = ({ children }) => {
  useScrollToTop();
  const mockData = useSelector(getMockData);
  const {
    expirationDate,
    updated,
    month,
    day,
    loading,
    isUserLoggedIn,
  } = useData();

  const toggleEnrollmentSuccess = useSelector(getToggleEnrollmentSuccess);

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
            {loading ? (
              <Loader />
            ) : (
              <>
                <PeriodsToVerify
                  enrollmentData={mockData}
                  isUserLoggedIn={isUserLoggedIn}
                  link={() => (
                    <PageLink
                      linkText="Start enrollment verification"
                      relativeURL={VERIFICATION_REVIEW_RELATIVE_URL}
                      URL={VERIFICATION_REVIEW_URL}
                      margin="0"
                      className="vye-mimic-va-button vads-u-font-family--sans"
                    />
                  )}
                  toggleEnrollmentSuccess={toggleEnrollmentSuccess}
                />
                <CurrentBenefitsStatus
                  updated={updated}
                  remainingBenefits={`${month} Months, ${day} Days`}
                  expirationDate={expirationDate}
                  link={() => (
                    <PageLink
                      linkText="Manage your benefits profile"
                      relativeURL={BENEFITS_PROFILE_RELATIVE_URL}
                      URL={BENEFITS_PROFILE_URL}
                      margin="0"
                      className="vads-c-action-link--blue"
                    />
                  )}
                />
              </>
            )}
            <PreviousEnrollmentVerifications enrollmentData={mockData} />
            <MoreInfoCard
              marginTop="7"
              linkText="Manage your benefits profile"
              relativeURL={BENEFITS_PROFILE_RELATIVE_URL}
              URL={BENEFITS_PROFILE_URL}
              className="vads-u-font-family--sans vads-u-font-weight--bold"
              linkDescription="Update your contact and direct deposit information for the Montgomery GI Bill."
            />
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
