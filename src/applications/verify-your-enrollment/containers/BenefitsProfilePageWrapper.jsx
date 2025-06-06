import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { focusElement } from 'platform/utilities/ui';
import { useFeatureToggle } from 'platform/utilities/feature-toggles';
import { useSelector } from 'react-redux';
import { selectProfile } from '~/platform/user/selectors';
import EnrollmentVerificationBreadcrumbs from '../components/EnrollmentVerificationBreadcrumbs';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import BenefitsProfileStatement from '../components/BenefitsProfileStatement';
import PayeeInformationWrapper from './PayeeInformationWrapper';
import PendingDocuments from '../components/PendingDocuments';
import {
  VERIFICATION_RELATIVE_URL,
  VERIFICATION_PROFILE_URL,
} from '../constants';
import { useData } from '../hooks/useData';
import CurrentBenefitsStatus from '../components/CurrentBenefitsStatus';
import MoreInfoCard from '../components/MoreInfoCard';
import NeedHelp from '../components/NeedHelp';
import Loader from '../components/Loader';
import LoginAlert from '../components/LoginAlert';

const BenefitsProfileWrapper = ({ children }) => {
  const {
    loading,
    expirationDate,
    updated,
    month,
    day,
    indicator: applicantChapter,
    pendingDocuments,
    latestAddress,
    claimantId,
    fullName,
  } = useData();

  const profile = useSelector(selectProfile);
  const applicantName = latestAddress?.veteranName;
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const toggleValue = useToggleValue(
    TOGGLE_NAMES.toggleVyeAddressDirectDepositForms,
  );
  const signIn = profile?.signIn;
  useEffect(() => {
    focusElement('h1');
  }, []);
  return (
    <>
      <div />
      <div className="vads-l-grid-container desktop-lg:vads-u-padding-x--0">
        <div className="vads-l-row vads-u-margin-x--neg1p5 medium-screen:vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12">
            <EnrollmentVerificationBreadcrumbs />
          </div>
        </div>
        <div className="vads-l-row vads-u-margin-x--neg2p5">
          <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
            <BenefitsProfileStatement />
            {loading ? (
              <Loader aria-hidden="true" />
            ) : (
              <CurrentBenefitsStatus
                updated={updated}
                remainingBenefits={`${month} Months, ${day} Days`}
                expirationDate={expirationDate}
                indicator={applicantChapter}
              />
            )}
            <PayeeInformationWrapper
              loading={loading}
              applicantChapter={applicantChapter}
              applicantName={applicantName || fullName}
            />
            {(toggleValue || window.isProduction) && !claimantId ? (
              <>
                <ChangeOfAddressWrapper
                  loading={loading}
                  applicantName={applicantName}
                  mailingAddress={{
                    street: `${
                      latestAddress?.address1
                    } ${latestAddress?.address2 ?? ''}`,
                    street2: `${latestAddress?.address3 ??
                      ''} ${latestAddress?.address4 ?? ''}`,
                    city: latestAddress?.city,
                    stateCode: latestAddress?.state,
                    zipCode: latestAddress?.zipCode,
                  }}
                />
                {signIn?.serviceName === 'idme' ||
                signIn?.serviceName === 'logingov' ? (
                  <ChangeOfDirectDepositWrapper applicantName={applicantName} />
                ) : (
                  <LoginAlert />
                )}
              </>
            ) : null}
            {!claimantId && (
              <PendingDocuments
                loading={loading}
                pendingDocuments={pendingDocuments}
              />
            )}
            {children}
            <MoreInfoCard
              marginTop="7"
              linkText="Verify your school enrollment"
              relativeURL={VERIFICATION_RELATIVE_URL}
              URL={VERIFICATION_PROFILE_URL}
              className="vads-u-font-family--sans vads-u-font-weight--bold"
              linkDescription="If you're using GI Bill benefits, you can verify your enrollment for school or training on VA.gov."
            />
            <NeedHelp />
          </div>
        </div>
        <va-back-to-top />
      </div>
    </>
  );
};

BenefitsProfileWrapper.propTypes = {
  children: PropTypes.any,
};

export default BenefitsProfileWrapper;
