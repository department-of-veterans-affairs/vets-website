import React from 'react';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import DowntimeNotification, {
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import { focusElement } from 'platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';

import FraudVictimAlert from './FraudVictimAlert';
import PaymentHistory from './PaymentHistory';
import BankInfoCNPv2 from './BankInfoCNPv2';

const DirectDeposit = () => {
  // const [showSaveSucceededAlert, setShowSaveSucceededAlert] = React.useState(
  //   false,
  // );

  // const isSavingBankInfo = directDepositUiState.isSaving;
  // const wasSavingBankInfo = usePrevious(directDepositUiState.isSaving);

  React.useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit | Veterans Affairs`;
  }, []);

  // show the user a success alert after their bank info has saved
  // React.useEffect(
  //   () => {
  //     if (wasSavingBankInfo && !isSavingBankInfo && !saveError) {
  //       setShowSaveSucceededAlert(true);
  //       setTimeout(() => {
  //         setShowSaveSucceededAlert(false);
  //       }, 6000);
  //     }
  //   },
  //   [wasSavingBankInfo, isSavingBankInfo, saveError],
  // );

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
          {/* TODO: only show this if we just completed an update */}
          <AlertBox
            status="success"
            backgroundOnly
            className="vads-u-margin-top--0 vads-u-margin-bottom--2"
            scrollOnShow
          >
            We’ve updated your bank account information for your{' '}
            <strong>compensation and pension benefits</strong>
          </AlertBox>
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
      <PaymentHistory />
      <FraudVictimAlert />
    </>
  );
};

export default DirectDeposit;
