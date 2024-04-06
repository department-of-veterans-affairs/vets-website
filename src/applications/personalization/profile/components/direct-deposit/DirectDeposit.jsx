import React from 'react';
import { Prompt } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import LoadFail from '@@profile/components/alerts/LoadFail';
import { handleDowntimeForSection } from '@@profile/components/alerts/DowntimeBanner';
import Headline from '@@profile/components/ProfileSectionHeadline';
import { useDirectDeposit, useDirectDepositEffects } from '@@profile/hooks';

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

import { saveDirectDeposit } from '../../actions/directDeposit';
import { DirectDepositDevWidget } from './DirectDepositDevWidget';
import { Ineligible } from './alerts/Ineligible';

const cardHeadingId = 'bank-account-information';

// layout wrapper for common styling
const Wrapper = ({ children }) => {
  return (
    <div className="vads-u-margin-y--2">
      <Headline dataTestId="unified-direct-deposit">
        Direct deposit information
      </Headline>
      {children}
    </div>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DirectDeposit = () => {
  const dispatch = useDispatch();

  const directDepositHook = useDirectDeposit();

  const {
    ui,
    paymentAccount,
    controlInformation,
    isIdentityVerified,
    isBlocked,
    useOAuth,
    showUpdateSuccess,
    formData,
    saveError,
    loadError,
    setFormData,
    editButtonRef,
    cancelButtonRef,
    hasUnsavedFormEdits,
  } = directDepositHook;

  useDirectDepositEffects({ ...directDepositHook, cardHeadingId });

  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  // TODO: rename toggle to not include CompAndPen legacy naming
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

  if (loadError) {
    return (
      <Wrapper>
        <LoadFail />
        <PaymentHistoryCard />
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

  if (controlInformation?.canUpdateDirectDeposit === false) {
    return (
      <Wrapper>
        <Ineligible />
        <PaymentHistoryCard />
      </Wrapper>
    );
  }

  const cardDataValue = ui.isEditing ? (
    <AccountUpdateView
      isSaving={ui.isSaving}
      formData={formData}
      formSubmit={() => dispatch(saveDirectDeposit(formData))}
      saveError={saveError}
      setFormData={setFormData}
      cancelButtonRef={cancelButtonRef}
      hasUnsavedFormEdits={hasUnsavedFormEdits}
    />
  ) : (
    <AccountInfoView
      showUpdateSuccess={showUpdateSuccess}
      paymentAccount={paymentAccount}
      editButtonRef={editButtonRef}
      isSaving={ui.isSaving}
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

        <PaymentHistoryCard />
      </Wrapper>
    </div>
  );
};
