import React from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useDirectDeposit, useDirectDepositEffects } from '@@profile/hooks';

import Headline from '@@profile/components/ProfileSectionHeadline';
import { ProfileInfoCard } from '@@profile/components/ProfileInfoCard';
import LoadFail from '@@profile/components/alerts/LoadFail';
import { handleDowntimeForSection } from '@@profile/components/alerts/DowntimeBanner';

import VerifyIdentity from '@@profile/components/direct-deposit/alerts/VerifyIdentity';
import { TemporaryOutage } from '@@profile/components/direct-deposit/alerts/TemporaryOutage';
import DirectDepositBlocked from '@@profile/components/direct-deposit/alerts/DirectDepositBlocked';
import { Ineligible } from '@@profile/components/direct-deposit/alerts/Ineligible';
import { AccountInfoView } from '@@profile/components/direct-deposit/AccountInfoView';
import { AccountUpdateView } from '@@profile/components/direct-deposit/AccountUpdateView';
import { DirectDepositDevWidget } from '@@profile/components/direct-deposit/DirectDepositDevWidget';
import { FraudVictimSummary } from '@@profile/components/direct-deposit/FraudVictimSummary';
import { PaymentHistoryCard } from '@@profile/components/direct-deposit/PaymentHistoryCard';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

const cardHeadingId = 'bank-account-information';

// layout wrapper for common styling
const Wrapper = ({ children, withPaymentHistory }) => {
  return (
    <div className="vads-u-margin-y--2">
      <Headline dataTestId="unified-direct-deposit">
        Direct deposit information
      </Headline>
      {children}
      {withPaymentHistory && <PaymentHistoryCard />}
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  withPaymentHistory: PropTypes.bool,
};

Wrapper.defaultProps = {
  withPaymentHistory: true,
};

export const DirectDeposit = () => {
  const directDepositHookResult = useDirectDeposit();

  const {
    ui,
    paymentAccount,
    controlInformation,
    isIdentityVerified,
    isBlocked,
    useOAuth,
    showUpdateSuccess,
    formData,
    onFormSubmit,
    saveError,
    loadError,
    setFormData,
    hasUnsavedFormEdits,
    isEligible,
  } = directDepositHookResult;

  useDirectDepositEffects({ ...directDepositHookResult, cardHeadingId });

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const hideDirectDeposit = useToggleValue(
    TOGGLE_NAMES.profileHideDirectDeposit,
  );

  const profileShowDirectDepositSingleFormUAT = useToggleValue(
    TOGGLE_NAMES.profileShowDirectDepositSingleFormUAT,
  );

  const togglesLoading = useToggleLoadingValue();

  if (togglesLoading) {
    return (
      <Wrapper withPaymentHistory={false}>
        <va-loading-indicator />
      </Wrapper>
    );
  }

  if (hideDirectDeposit && !profileShowDirectDepositSingleFormUAT) {
    return (
      <Wrapper>
        <TemporaryOutage customMessaging />
        <FraudVictimSummary />
      </Wrapper>
    );
  }

  if (loadError) {
    return (
      <Wrapper>
        <LoadFail />
      </Wrapper>
    );
  }

  if (isBlocked) {
    return (
      <Wrapper withPaymentHistory={false}>
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

  if (!isEligible) {
    return (
      <Wrapper>
        <Ineligible />
      </Wrapper>
    );
  }

  // render the form or the account info view into the card data value
  // based on the UI state isEditing
  const cardDataValue = ui.isEditing ? (
    <AccountUpdateView
      isSaving={ui.isSaving}
      formSubmit={onFormSubmit}
      {...directDepositHookResult}
    />
  ) : (
    <AccountInfoView
      ref={directDepositHookResult.editButtonRef}
      isSaving={ui.isSaving}
      {...directDepositHookResult}
    />
  );

  return (
    <div>
      <Prompt
        message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
        when={hasUnsavedFormEdits}
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
            namedAnchor={cardHeadingId}
            level={2}
          />
        </DowntimeNotification>

        <DirectDepositDevWidget
          debugData={{
            controlInformation,
            paymentAccount,
            ui,
            isIdentityVerified,
            isBlocked,
            useOAuth,
            showUpdateSuccess,
            formData,
            saveError,
            loadError,
            hasUnsavedFormEdits,
            setFormData,
          }}
        />

        <FraudVictimSummary />
      </Wrapper>
    </div>
  );
};
