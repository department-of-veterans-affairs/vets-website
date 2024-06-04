import React from 'react';
import { useSelector } from 'react-redux';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import ChangeOfAddressWrapper from './ChangeOfAddressWrapper';
import ChangeOfDirectDepositWrapper from './ChangeOfDirectDepositWrapper';
import { useData } from '../hooks/useData';
import LoginAlert from '../components/LoginAlert';

const BenefitsProfileWrapper = () => {
  const { loading, latestAddress } = useData();
  const applicantName = latestAddress?.veteranName;
  const { profile } = useSelector(state => state.user || {});
  const {
    signIn: { serviceName },
  } = profile;
  return (
    <>
      {loading ? (
        <va-loading-indicator
          label="Loading"
          message="Loading mailing address..."
        />
      ) : (
        <section className="profile-info-card vads-u-margin-bottom--6">
          {!serviceName ||
          [CSP_IDS.DS_LOGON, CSP_IDS.MHV].includes(serviceName) ? (
            <LoginAlert />
          ) : (
            <ChangeOfDirectDepositWrapper applicantName={applicantName} />
          )}
          <ChangeOfAddressWrapper
            applicantName={applicantName}
            mailingAddress={{
              street: `${latestAddress?.address1} ${latestAddress?.address2 ??
                ''}`,
              city: latestAddress?.city,
              stateCode: latestAddress?.state,
              zipCode: latestAddress?.zipCode,
            }}
          />
        </section>
      )}
    </>
  );
};

export default BenefitsProfileWrapper;
