import React, { useEffect } from 'react';
import { Prompt } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import LoadFail from '@@profile/components/alerts/LoadFail';
import { handleDowntimeForSection } from '@@profile/components/alerts/DowntimeBanner';
import Headline from '@@profile/components/ProfileSectionHeadline';
import { useDirectDeposit } from '@@profile/hooks';

import { focusElement } from '~/platform/utilities/ui';
import { DevTools } from '~/applications/personalization/common/components/devtools/DevTools';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

import VerifyIdentity from './alerts/VerifyIdentity';
import { TemporaryOutage } from './alerts/TemporaryOutage';
import DirectDepositBlocked from './alerts/DirectDepositBlocked';
import { AccountInfoView } from './AccountInfoView';
import { AccountUpdateView } from './AccountUpdateView';
import { FraudVictimSummary } from './FraudVictimSummary';
import { PaymentHistoryCard } from './PaymentHistoryCard';
import { ProfileInfoCard } from '../ProfileInfoCard';
import { toggleDirectDepositEdit } from '../../actions/directDeposit';

// layout wrapper for common styling
const Wrapper = ({ children }) => {
  return <div className="vads-u-margin-y--2">{children}</div>;
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DirectDeposit = () => {
  const dispatch = useDispatch();

  const {
    ui,
    paymentAccount,
    controlInformation,
    error,
    hasLoadError,
    formIsDirty,
    isIdentityVerified,
    isBlocked,
    useOAuth,
    showUpdateSuccess,
  } = useDirectDeposit();

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  // TODO: rename toggle to not include CompAndPen
  const hideDirectDepositViaToggle = useToggleValue(
    TOGGLE_NAMES.profileHideDirectDepositCompAndPen,
  );

  // page setup effects
  useEffect(
    () => {
      focusElement('[data-focus-target]');
      document.title = `Direct Deposit Information | Veterans Affairs`;
      dispatch(toggleDirectDepositEdit(false));
    },
    [dispatch],
  );

  // effect to show an alert when the form is dirty and navigating away
  useEffect(
    () => {
      if (formIsDirty && isIdentityVerified) {
        window.onbeforeunload = () => true;
        return;
      }
      window.onbeforeunload = undefined;
    },
    [formIsDirty, isIdentityVerified],
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

  if (hasLoadError) {
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

  const cardDataValue = ui.isEditing ? (
    <AccountUpdateView isSaving={ui.isSaving} error={error} />
  ) : (
    <AccountInfoView
      showUpdateSuccess={showUpdateSuccess}
      paymentAccount={paymentAccount}
    />
  );

  return (
    <div>
      <Headline dataTestId="unified-direct-deposit">
        Direct deposit information
      </Headline>

      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={formIsDirty}
      />

      <Wrapper>
        <DowntimeNotification
          appTitle="direct deposit"
          render={handleDowntimeForSection('direct deposit')}
          dependencies={[externalServices.vaProfile]}
        >
          <ProfileInfoCard
            title="Bank account information"
            data={[{ value: cardDataValue }]}
          />
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
