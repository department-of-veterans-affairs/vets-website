import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/component-library/Telephone';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled,
} from '~/platform/user/selectors';
import { signInServiceName as signInServiceNameSelector } from '~/platform/user/authentication/selectors';
import environment from '~/platform/utilities/environment';
import { focusElement } from '~/platform/utilities/ui';
import { usePrevious } from '~/platform/utilities/react-hooks';

import {
  cnpDirectDepositUiState,
  eduDirectDepositUiState,
} from '@@profile/selectors';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import SetUp2FAAlert from '../alerts/SetUp2FAAlert';

import Headline from '../ProfileSectionHeadline';

import FraudVictimAlert from './FraudVictimAlert';
import PaymentHistory from './PaymentHistory';
import BankInfoCNP from './BankInfoCNP';
import BankInfoEDU from './BankInfoEDU';

export const benefitTypes = {
  CNP: 'compensation and pension benefits',
  EDU: 'education benefits',
};

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

const DirectDeposit = ({ cnpUiState, eduUiState, isVerifiedUser }) => {
  const [
    recentlySavedBankInfo,
    setRecentlySavedBankInfoForBenefit,
  ] = React.useState('');

  const isSavingCNPBankInfo = cnpUiState.isSaving;
  const wasSavingCNPBankInfo = usePrevious(cnpUiState.isSaving);
  const cnpSaveError = cnpUiState.responseError;
  const isSavingEDUBankInfo = eduUiState.isSaving;
  const wasSavingEDUBankInfo = usePrevious(eduUiState.isSaving);
  const eduSaveError = eduUiState.responseError;
  const showSetUp2FactorAuthentication = !isVerifiedUser;

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

  return (
    <>
      <Headline>Direct deposit information</Headline>
      {environment.isProduction() ? (
        <AlertBox
          status="warning"
          isVisible
          headline="Direct deposit isn’t available right now"
          content={
            <>
              <p>
                We’re sorry. Direct deposit isn’t available right now. We’re
                working to fix the issue as soon as possible. Please check back
                after 5 p.m. ET, Monday, August 23 for an update.
              </p>
              <h4>What you can do</h4>
              <p>
                If you have questions or concerns related to your direct
                deposit, call us at{' '}
                <a
                  href="tel:1-800-827-1000"
                  aria-label="800. 8 2 7. 1000."
                  title="Dial the telephone number 800-827-1000"
                  className="no-wrap"
                >
                  800-827-1000
                </a>{' '}
                (TTY:{' '}
                <Telephone
                  contact={CONTACTS['711']}
                  pattern={PATTERNS['911']}
                />
                ). We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.
                Or go to your{' '}
                <a href="/find-locations/?facilityType=benefits">
                  nearest VA regional office
                </a>
                .
              </p>
            </>
          }
        />
      ) : (
        <>
          <div id="success" role="alert" aria-atomic="true">
            <ReactCSSTransitionGroup
              transitionName="form-expanding-group-inner"
              transitionAppear
              transitionAppearTimeout={bankInfoUpdatedAlertSettings.FADE_SPEED}
              transitionEnterTimeout={bankInfoUpdatedAlertSettings.FADE_SPEED}
              transitionLeaveTimeout={bankInfoUpdatedAlertSettings.FADE_SPEED}
            >
              {!!recentlySavedBankInfo && (
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
              )}
            </ReactCSSTransitionGroup>
          </div>

          {showSetUp2FactorAuthentication && <SetUp2FAAlert />}
          {!showSetUp2FactorAuthentication && (
            <DowntimeNotification
              appTitle="direct deposit"
              render={handleDowntimeForSection(
                'direct deposit for compensation and pension',
              )}
              dependencies={[externalServices.evss]}
            >
              <BankInfoCNP />
            </DowntimeNotification>
          )}
          <FraudVictimAlert status={ALERT_TYPE.INFO} />
          {!showSetUp2FactorAuthentication && (
            <>
              <BankInfoEDU />
              <PaymentHistory />
            </>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = state => {
  const isLOA3 = isLOA3Selector(state);
  const is2faEnabled = isMultifactorEnabled(state);
  const isIDme = signInServiceNameSelector(state) === 'idme';
  return {
    isVerifiedUser: isLOA3 && isIDme && is2faEnabled,
    cnpUiState: cnpDirectDepositUiState(state),
    eduUiState: eduDirectDepositUiState(state),
  };
};

export default connect(mapStateToProps)(DirectDeposit);
