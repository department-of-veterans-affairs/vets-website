import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  cnpDirectDepositUiState,
  eduDirectDepositUiState,
  selectHideDirectDepositCompAndPen,
} from '@@profile/selectors';
import { Prompt } from 'react-router-dom';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled,
} from '~/platform/user/selectors';
import {
  signInServiceName as signInServiceNameSelector,
  isAuthenticatedWithOAuth,
} from '~/platform/user/authentication/selectors';
import { focusElement } from '~/platform/utilities/ui';
import { usePrevious } from '~/platform/utilities/react-hooks';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import VerifyIdentity from './alerts/VerifyIdentity';

import Headline from '../ProfileSectionHeadline';

import FraudVictimAlert from './alerts/FraudVictimAlert';
import PaymentHistory from './PaymentHistory';
import BankInfo from './BankInfo';
import { benefitTypes } from '~/applications/personalization/common/constants';

import DirectDepositWrapper from './DirectDepositWrapper';
import TemporaryOutageCnp from './alerts/TemporaryOutageCnp';

import { BANK_INFO_UPDATED_ALERT_SETTINGS } from '../../constants';
import { EduMigrationAlert } from './alerts/EduMigrationAlert';

const DirectDeposit = ({
  cnpUiState,
  eduUiState,
  isVerifiedUser,
  hideDirectDepositCompAndPen,
  useOAuth,
}) => {
  const [showCNPSuccessMessage, setShowCNPSuccessMessage] = useState(false);
  const [showEDUSuccessMessage, setShowEDUSuccessMessage] = useState(false);

  const [cnpFormIsDirty, setCnpFormIsDirty] = useState(false);

  const [eduFormIsDirty, setEduFormIsDirty] = useState(false);

  const [viewingIsRestricted, setViewingIsRestricted] = useState(false);
  const [viewingPayments, setViewingPayments] = useState({
    [benefitTypes.CNP]: true,
    [benefitTypes.EDU]: true,
  });

  const allFormsAreEmpty = eduFormIsDirty && cnpFormIsDirty;

  const isSavingCNPBankInfo = cnpUiState.isSaving;
  const wasSavingCNPBankInfo = usePrevious(cnpUiState.isSaving);
  const cnpSaveError = cnpUiState.responseError;
  const isSavingEDUBankInfo = eduUiState.isSaving;
  const wasSavingEDUBankInfo = usePrevious(eduUiState.isSaving);
  const eduSaveError = eduUiState.responseError;
  const showBankInformation = isVerifiedUser;

  const removeBankInfoUpdatedAlert = useCallback(() => {
    setTimeout(() => {
      setShowCNPSuccessMessage(false);
      setShowEDUSuccessMessage(false);
    }, BANK_INFO_UPDATED_ALERT_SETTINGS.TIMEOUT);
  }, []);

  useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit Information | Veterans Affairs`;
  }, []);

  // show the user a success alert after their CNP bank info has saved
  useEffect(
    () => {
      if (wasSavingCNPBankInfo && !isSavingCNPBankInfo && !cnpSaveError) {
        setShowCNPSuccessMessage(true);
        removeBankInfoUpdatedAlert();
      }
    },
    [
      wasSavingCNPBankInfo,
      isSavingCNPBankInfo,
      cnpSaveError,
      removeBankInfoUpdatedAlert,
    ],
  );

  // show the user a success alert after their EDU bank info has saved
  useEffect(
    () => {
      if (wasSavingEDUBankInfo && !isSavingEDUBankInfo && !eduSaveError) {
        removeBankInfoUpdatedAlert();
        setShowEDUSuccessMessage(true);
      }
    },
    [
      wasSavingEDUBankInfo,
      isSavingEDUBankInfo,
      eduSaveError,
      removeBankInfoUpdatedAlert,
    ],
  );

  // fix for when the TemporaryOutage is displayed
  // prevents alert from showing when navigating away from DD page and no edits have been made
  useEffect(
    () => {
      if (hideDirectDepositCompAndPen) {
        setCnpFormIsDirty(true);
      }
    },
    [hideDirectDepositCompAndPen, setCnpFormIsDirty],
  );

  useEffect(
    () => {
      // Show alert when navigating away
      if (!allFormsAreEmpty && !viewingIsRestricted) {
        window.onbeforeunload = () => true;
        return;
      }
      window.onbeforeunload = undefined;
    },
    [allFormsAreEmpty, viewingIsRestricted],
  );

  return (
    <>
      <Headline>Direct deposit information</Headline>

      <DirectDepositWrapper setViewingIsRestricted={setViewingIsRestricted}>
        <Prompt
          message="Are you sure you want to leave? If you leave, your in-progress work won’t be saved."
          when={!allFormsAreEmpty}
        />
        {showBankInformation ? (
          <DowntimeNotification
            appTitle="direct deposit"
            render={handleDowntimeForSection(
              'direct deposit for compensation and pension',
            )}
            dependencies={[externalServices.evss]}
          >
            {hideDirectDepositCompAndPen ? (
              <TemporaryOutageCnp />
            ) : (
              <>
                <EduMigrationAlert />
                <BankInfo
                  type={benefitTypes.CNP}
                  setFormIsDirty={setCnpFormIsDirty}
                  setViewingPayments={setViewingPayments}
                  showSuccessMessage={showCNPSuccessMessage}
                />
              </>
            )}
          </DowntimeNotification>
        ) : (
          <VerifyIdentity useOAuth={useOAuth} />
        )}
        <FraudVictimAlert />
        {showBankInformation ? (
          <>
            <BankInfo
              type={benefitTypes.EDU}
              setFormIsDirty={setEduFormIsDirty}
              setViewingPayments={setViewingPayments}
              showSuccessMessage={showEDUSuccessMessage}
            />
            {(viewingPayments[benefitTypes.CNP] ||
              viewingPayments[benefitTypes.EDU]) && <PaymentHistory />}
          </>
        ) : null}
      </DirectDepositWrapper>
    </>
  );
};

DirectDeposit.propTypes = {
  cnpUiState: PropTypes.shape({
    isSaving: PropTypes.bool.isRequired,
    responseError: PropTypes.object,
  }).isRequired,
  eduUiState: PropTypes.shape({
    isSaving: PropTypes.bool.isRequired,
    responseError: PropTypes.object,
  }).isRequired,
  hideDirectDepositCompAndPen: PropTypes.bool.isRequired,
  isVerifiedUser: PropTypes.bool.isRequired,
  useOAuth: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  const eligibleSignInServices = new Set([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]);
  const isLOA3 = isLOA3Selector(state);
  const is2faEnabled = isMultifactorEnabled(state);
  const signInServiceName = signInServiceNameSelector(state);
  const isUsingEligibleSignInService = eligibleSignInServices.has(
    signInServiceName,
  );
  return {
    isVerifiedUser: isLOA3 && isUsingEligibleSignInService && is2faEnabled,
    cnpUiState: cnpDirectDepositUiState(state),
    eduUiState: eduDirectDepositUiState(state),
    hideDirectDepositCompAndPen: selectHideDirectDepositCompAndPen(state),
    useOAuth: isAuthenticatedWithOAuth(state),
  };
};

export default connect(mapStateToProps)(DirectDeposit);
