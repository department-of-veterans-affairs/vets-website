import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const FinancialInformation = () => {
  return (
    <Tier2PageContent pageHeader="Financial information">
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.DIRECT_DEPOSIT}
        content="Manage direct deposit information for disability compensation, pension, and education benefits"
        href={PROFILE_PATHS.DIRECT_DEPOSIT}
        reactLink
      />
      <ProfileHubItem
        heading="VA debt and bills"
        content="Review the details of debt from VA education, disability compensation, pension programs, or VA health care and prescription charges"
        href="/manage-va-debt/summary"
      />
      <ProfileHubItem
        heading="VA payment history"
        content="Review your payment history for your VA disability compensation, pension, and education benefits"
        href="/va-payment-history/payments"
      />
    </Tier2PageContent>
  );
};

FinancialInformation.propTypes = {};

export default FinancialInformation;
