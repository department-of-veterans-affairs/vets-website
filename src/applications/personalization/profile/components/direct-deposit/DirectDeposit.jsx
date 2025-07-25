import React from 'react';
import { Prompt } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useDirectDeposit, useDirectDepositEffects } from '@@profile/hooks';

import Headline from '@@profile/components/ProfileSectionHeadline';
import { ProfileInfoSection } from '@@profile/components/ProfileInfoSection';
import LoadFail from '@@profile/components/alerts/LoadFail';

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
import { COULD_NOT_DETERMINE_DUE_TO_EXCEPTION } from './config/enums';

const cardHeadingId = 'bank-account-information';

// layout wrapper for common styling
const Wrapper = ({ children, withPaymentHistory }) => {
  return (
    <>
      <Headline dataTestId="unified-direct-deposit">
        Direct deposit information
      </Headline>
      {children}
      {withPaymentHistory && <PaymentHistoryCard />}
    </>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  withPaymentHistory: PropTypes.bool,
};

Wrapper.defaultProps = {
  withPaymentHistory: true,
};

const MontgomeryGiBillDescription = () => (
  <va-additional-info
    trigger=" How to update your direct deposit information for Montgomery GI Bill"
    class="vads-u-margin-top--4 gi-bill-info"
    uswds
    data-testid="gi-bill-additional-info"
  >
    <div>
      <p
        className="vads-u-margin-top--0 vads-u-color--black"
        data-testid="gi-bill-description"
      >
        If you’re getting benefits through the Montgomery GI Bill Active Duty
        (MGIB-AD) or Montgomery GI Bill Selected Reserve (MGIB-SR), you’ll need
        to update your direct deposit information using our enrollment
        verification tool.
      </p>
      <p className="vads-u-margin-bottom--0">
        <va-link
          href="https://www.va.gov/education/verify-school-enrollment/#for-montgomery-gi-bill-benefit"
          text="Update direct deposit information for MGIB benefits"
          data-testid="gi-bill-update-link"
        />
      </p>
    </div>
  </va-additional-info>
);

export const DirectDeposit = () => {
  const directDepositHookResult = useDirectDeposit();

  const {
    ui,
    paymentAccount,
    controlInformation,
    veteranStatus,
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
  const nonVeteranFeatureFlag = useToggleValue(
    TOGGLE_NAMES.profileLimitDirectDepositForNonBeneficiaries,
  );

  const togglesLoading = useToggleLoadingValue();

  if (togglesLoading) {
    return (
      <Wrapper withPaymentHistory={false}>
        <va-loading-indicator />
      </Wrapper>
    );
  }

  if (hideDirectDeposit) {
    return (
      <Wrapper>
        <TemporaryOutage customMessaging />
        <FraudVictimSummary />
      </Wrapper>
    );
  }

  if (
    loadError ||
    (nonVeteranFeatureFlag &&
      veteranStatus === COULD_NOT_DETERMINE_DUE_TO_EXCEPTION)
  ) {
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
          appTitle="direct deposit information page"
          dependencies={[externalServices.LIGHTHOUSE_DIRECT_DEPOSIT]}
        >
          <ProfileInfoSection
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
        <MontgomeryGiBillDescription />
        <FraudVictimSummary />
      </Wrapper>
    </div>
  );
};
