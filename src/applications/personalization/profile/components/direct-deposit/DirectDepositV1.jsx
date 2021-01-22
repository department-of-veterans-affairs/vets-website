import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DowntimeNotification, {
  externalServices,
} from '~/platform/monitoring/DowntimeNotification';
import {
  isLOA3 as isLOA3Selector,
  isMultifactorEnabled,
} from '~/platform/user/selectors';
import { isAuthenticatedWithSSOe as isAuthenticatedWithSSOeSelector } from '~/platform/user/authentication/selectors';
import { focusElement } from '~/platform/utilities/ui';

import { handleDowntimeForSection } from '../alerts/DowntimeBanner';
import SetUp2FAAlert from '../alerts/SetUp2FAAlert';

import FraudVictimAlert from './FraudVictimAlert';
import BankInfoCNP from './BankInfoCNP';
import DirectDepositEDU from './DirectDepositEDUEbenefits';

const DirectDeposit = ({ is2faEnabled, isAuthenticatedWithSSOe, isLOA3 }) => {
  const showSetUp2FactorAuthentication = isLOA3 && !is2faEnabled;

  useEffect(() => {
    focusElement('[data-focus-target]');
    document.title = `Direct Deposit | Veterans Affairs`;
  }, []);

  return (
    <>
      <h2
        tabIndex="-1"
        className="vads-u-margin-y--2 medium-screen:vads-u-margin-bottom--4 medium-screen:vads-u-margin-top--3"
        data-focus-target
      >
        Direct deposit information
      </h2>
      {showSetUp2FactorAuthentication && (
        <SetUp2FAAlert isAuthenticatedWithSSOe={isAuthenticatedWithSSOe} />
      )}
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
      <FraudVictimAlert />
      <DirectDepositEDU />
    </>
  );
};

DirectDeposit.propTypes = {
  isLOA3: PropTypes.bool.isRequired,
  is2faEnabled: PropTypes.bool.isRequired,
  isAuthenticatedWithSSOe: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  is2faEnabled: isMultifactorEnabled(state),
  isAuthenticatedWithSSOe: isAuthenticatedWithSSOeSelector(state),
  isLOA3: isLOA3Selector(state),
});

export default connect(mapStateToProps)(DirectDeposit);
