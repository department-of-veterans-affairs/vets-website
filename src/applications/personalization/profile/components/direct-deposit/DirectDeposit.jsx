import React from 'react';
import PropTypes from 'prop-types';

import { useDirectDeposit } from '@@profile/hooks';

import { Prompt } from 'react-router-dom';
import Headline from '../ProfileSectionHeadline';
import { DevTools } from '~/applications/personalization/common/components/devtools/DevTools';
import { FraudVictimSummary } from './FraudVictimSummary';
import LoadFail from '../alerts/LoadFail';
import VerifyIdentity from './alerts/VerifyIdentity';
import { PaymentHistoryCard } from './PaymentHistoryCard';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { BankInfo } from './BankInfo';
import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { TemporaryOutage } from './alerts/TemporaryOutage';
import DirectDepositBlocked from './alerts/DirectDepositBlocked';

// layout wrapper for common styling
const Wrapper = ({ children }) => {
  return <div className="vads-u-margin-y--2">{children}</div>;
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DirectDeposit = () => {
  const {
    paymentAccount,
    controlInformation,
    error,
    formIsDirty,
    isIdentityVerified,
    isBlocked,
    useOAuth,
  } = useDirectDeposit();

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();
  const hideDirectDepositViaToggle = useToggleValue(
    TOGGLE_NAMES.profileHideDirectDepositCompAndPen,
  );

  const togglesLoading = useToggleLoadingValue();
  if (togglesLoading) {
    return (
      <Wrapper>
        <va-loading-indicator />
      </Wrapper>
    );
  }

  if (hideDirectDepositViaToggle) {
    return (
      <Wrapper>
        <TemporaryOutage />
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <LoadFail />
      </Wrapper>
    );
  }

  if (isBlocked) {
    return (
      <Wrapper>
        <DirectDepositBlocked />
      </Wrapper>
    );
  }

  if (!isIdentityVerified) {
    return (
      <Wrapper>
        <VerifyIdentity useOAuth={useOAuth} />
      </Wrapper>
    );
  }

  return (
    <div>
      <Headline dataTestId="unified-direct-deposit">
        Direct deposit information
      </Headline>

      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={!formIsDirty}
      />

      <Wrapper>
        <DowntimeNotification
          appTitle="direct deposit"
          render={handleDowntimeForSection('direct deposit')}
          dependencies={[externalServices.vaProfile]}
        >
          <BankInfo />
        </DowntimeNotification>

        <FraudVictimSummary />

        <PaymentHistoryCard />

        <DevTools
          devToolsData={{
            paymentAccount,
            controlInformation,
            error,
            isIdentityVerified,
            isBlocked,
          }}
          alwaysShowChildren={false}
          panel
        />
      </Wrapper>
    </div>
  );
};
