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
import Loader from '../components/Loader';

const EnrollmentVerificationPageWrapper = ({ children }) => {
  useScrollToTop();
  const mockData = useSelector(getMockData);
  const { expirationDate, updated, month, day, loading } = useData();

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
            {loading ? (
              <Loader />
            ) : (
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
