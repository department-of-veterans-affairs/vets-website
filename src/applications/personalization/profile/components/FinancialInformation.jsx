import React from 'react';
import { PROFILE_PATHS, PROFILE_PATH_NAMES } from '../constants';
import Tier2PageContent from './Tier2PageContent';
import { ProfileHubItem } from './hub/ProfileHubItem';

const FinancialInformation = () => {
  return (
    <Tier2PageContent pageHeader="Financial information">
      <ProfileHubItem
        heading={PROFILE_PATH_NAMES.DIRECT_DEPOSIT}
        content="Add or edit your bank account information for disability compensation, pension, and education benefit payments."
        href={PROFILE_PATHS.DIRECT_DEPOSIT}
        reactLink
      />
      <ProfileHubItem
        heading="Payment history"
        content="Review your payment history for your disability compensation, pension, and education benefits."
        href="/va-payment-history/payments"
      />
      <ProfileHubItem
        heading="Overpayments and copay bills"
        content="Review benefit overpayments and health care copay bills."
        href="/manage-va-debt/summary"
      />
    </Tier2PageContent>
  );
};

FinancialInformation.propTypes = {};

export default FinancialInformation;
