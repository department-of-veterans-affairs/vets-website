import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/formation-react/AlertBox';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import { focusElement } from '~/platform/utilities/ui';
import { usePrevious } from '~/platform/utilities/react-hooks';

import {
  cnpDirectDepositUiState,
  eduDirectDepositUiState,
} from '@@profile/selectors';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';

import FraudVictimAlert from './FraudVictimAlert';
import PaymentHistory from './PaymentHistory';
import BankInfoCNPv2 from './BankInfoCNPv2';
import BankInfoEDU from './BankInfoEDU';

const DirectDeposit = ({ cnpUiState, eduUiState }) => {
  const [recentlySavedBankInfo, setRecentlySavedBankInfo] = React.useState('');

  const isSavingCNPBankInfo = cnpUiState.isSaving;
  const wasSavingCNPBankInfo = usePrevious(cnpUiState.isSaving);
  const cnpSaveError = cnpUiState.responseError;
  const isSavingEDUBankInfo = eduUiState.isSaving;
  const wasSavingEDUBankInfo = usePrevious(eduUiState.isSaving);
  const eduSaveError = eduUiState.responseError;

  const removeBankInfoUpdatedAlert = () => {
    setTimeout(() => {
      setRecentlySavedBankInfo('');
    }, 6000);
  };

  React.useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit | Veterans Affairs`;
  }, []);

  // show the user a success alert after their CNP bank info has saved
  React.useEffect(
    () => {
      if (wasSavingCNPBankInfo && !isSavingCNPBankInfo && !cnpSaveError) {
        setRecentlySavedBankInfo('compensation and pension benefits');
        removeBankInfoUpdatedAlert();
      }
    },
    [wasSavingCNPBankInfo, isSavingCNPBankInfo, cnpSaveError],
  );

  // show the user a success alert after their EDU bank info has saved
  React.useEffect(
    () => {
      if (wasSavingEDUBankInfo && !isSavingEDUBankInfo && !eduSaveError) {
        setRecentlySavedBankInfo('education benefits');
        removeBankInfoUpdatedAlert();
      }
    },
    [wasSavingEDUBankInfo, isSavingEDUBankInfo, eduSaveError],
  );

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Direct deposit information
      </h2>
      <div id="success" role="alert" aria-atomic="true">
        <ReactCSSTransitionGroup
          transitionName="form-expanding-group-inner"
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {!!recentlySavedBankInfo && (
            <AlertBox
              status={ALERT_TYPE.SUCCESS}
              backgroundOnly
              className="vads-u-margin-top--0 vads-u-margin-bottom--2"
              scrollOnShow
            >
              We’ve updated your bank account information for your{' '}
              <strong>{recentlySavedBankInfo}</strong> and your next payment
              will go to your new account.
            </AlertBox>
          )}
        </ReactCSSTransitionGroup>
      </div>

      <DowntimeNotification
        appTitle="direct deposit"
        render={handleDowntimeForSection(
          'direct deposit for compensation and pension',
        )}
        dependencies={[externalServices.evss]}
      >
        <BankInfoCNPv2 />
      </DowntimeNotification>
      <FraudVictimAlert status={ALERT_TYPE.INFO} />
      <BankInfoEDU />
      <PaymentHistory />
    </>
  );
};

const mapStateToProps = state => {
  return {
    cnpUiState: cnpDirectDepositUiState(state),
    eduUiState: eduDirectDepositUiState(state),
  };
};

export default connect(mapStateToProps)(DirectDeposit);
