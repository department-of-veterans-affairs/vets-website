import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled,
} from '~/platform/user/selectors';
import {
  loginGov,
  signInServiceName as signInServiceNameSelector,
} from '~/platform/user/authentication/selectors';
import { focusElement } from '~/platform/utilities/ui';
import { usePrevious } from '~/platform/utilities/react-hooks';

import {
  cnpDirectDepositUiState,
  eduDirectDepositUiState,
} from '@@profile/selectors';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import UnsupportedAccountAlert from '../alerts/UnsupportedAccountAlert';

import Headline from '../ProfileSectionHeadline';

import FraudVictimAlert from './FraudVictimAlert';
import PaymentHistory from './PaymentHistory';
import BankInfo from './BankInfo';
import { benefitTypes } from '~/applications/personalization/common/constants';
import { Prompt } from 'react-router-dom';
import { CSP_IDS } from 'platform/user/authentication/constants';

const SuccessMessage = ({ benefit }) => {
  let content = null;
  switch (benefit) {
    case benefitTypes.CNP:
      content = (
        <>
          We’ve updated your bank account information for your{' '}
          <strong>compensation and pension benefits</strong>. This change should
          take place immediately.
        </>
      );
      break;
    case benefitTypes.EDU:
      content = (
        <>
          We’ve updated your bank account information for your{' '}
          <strong>education benefits</strong>. Your next payment will be
          deposited into your new account.
        </>
      );
      break;

    default:
      break;
  }

  return content;
};

const DirectDeposit = ({
  cnpUiState,
  eduUiState,
  isLoginGovSupported,
  isVerifiedUser,
}) => {
  const [
    recentlySavedBankInfo,
    setRecentlySavedBankInfoForBenefit,
  ] = React.useState('');

  const [cnpFormIsDirty, setCnpFormIsDirty] = React.useState(false);

  const [eduFormIsDirty, setEduFormIsDirty] = React.useState(false);

  const allFormsAreEmpty = eduFormIsDirty && cnpFormIsDirty;

  const isSavingCNPBankInfo = cnpUiState.isSaving;
  const wasSavingCNPBankInfo = usePrevious(cnpUiState.isSaving);
  const cnpSaveError = cnpUiState.responseError;
  const isSavingEDUBankInfo = eduUiState.isSaving;
  const wasSavingEDUBankInfo = usePrevious(eduUiState.isSaving);
  const eduSaveError = eduUiState.responseError;
  const showBankInformation = isVerifiedUser;

  const bankInfoUpdatedAlertSettings = {
    FADE_SPEED: window.Cypress ? 1 : 500,
    TIMEOUT: window.Cypress ? 500 : 6000,
  };

  const removeBankInfoUpdatedAlert = React.useCallback(
    () => {
      setTimeout(() => {
        setRecentlySavedBankInfoForBenefit('');
      }, bankInfoUpdatedAlertSettings.TIMEOUT);
    },
    [bankInfoUpdatedAlertSettings],
  );

  React.useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit Information | Veterans Affairs`;
  }, []);

  // show the user a success alert after their CNP bank info has saved
  React.useEffect(
    () => {
      if (wasSavingCNPBankInfo && !isSavingCNPBankInfo && !cnpSaveError) {
        setRecentlySavedBankInfoForBenefit(benefitTypes.CNP);
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
  React.useEffect(
    () => {
      if (wasSavingEDUBankInfo && !isSavingEDUBankInfo && !eduSaveError) {
        setRecentlySavedBankInfoForBenefit(benefitTypes.EDU);
        removeBankInfoUpdatedAlert();
      }
    },
    [
      wasSavingEDUBankInfo,
      isSavingEDUBankInfo,
      eduSaveError,
      removeBankInfoUpdatedAlert,
    ],
  );

  useEffect(
    () => {
      // Show alert when navigating away
      if (!allFormsAreEmpty) {
        window.onbeforeunload = () => true;
        return;
      }

      window.onbeforeunload = undefined;
    },
    [allFormsAreEmpty],
  );

  return (
    <>
      <Headline>Direct deposit information</Headline>
      <div id="success" role="alert" aria-atomic="true">
        <TransitionGroup>
          {!!recentlySavedBankInfo && (
            <CSSTransition
              classNames="form-expanding-group-inner"
              appear
              timeout={{
                appear: bankInfoUpdatedAlertSettings.FADE_SPEED,
                enter: bankInfoUpdatedAlertSettings.FADE_SPEED,
                exit: bankInfoUpdatedAlertSettings.FADE_SPEED,
              }}
            >
              <div data-testid="bankInfoUpdateSuccessAlert">
                <AlertBox
                  status={ALERT_TYPE.SUCCESS}
                  backgroundOnly
                  className="vads-u-margin-top--0 vads-u-margin-bottom--2"
                  scrollOnShow
                >
                  <SuccessMessage benefit={recentlySavedBankInfo} />
                </AlertBox>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
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
          <BankInfo
            type={benefitTypes.CNP}
            setFormIsDirty={setCnpFormIsDirty}
          />
        </DowntimeNotification>
      ) : (
        <UnsupportedAccountAlert isLoginGovSupported={isLoginGovSupported} />
      )}
      <FraudVictimAlert status={ALERT_TYPE.INFO} />
      {showBankInformation ? (
        <>
          <BankInfo
            type={benefitTypes.EDU}
            setFormIsDirty={setEduFormIsDirty}
          />
          <PaymentHistory />
        </>
      ) : null}
    </>
  );
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
    isLoginGovSupported: loginGov(state),
    isVerifiedUser: isLOA3 && isUsingEligibleSignInService && is2faEnabled,
    cnpUiState: cnpDirectDepositUiState(state),
    eduUiState: eduDirectDepositUiState(state),
  };
};

export default connect(mapStateToProps)(DirectDeposit);
