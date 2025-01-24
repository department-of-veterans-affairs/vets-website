import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { CSP_IDS } from '~/platform/user/authentication/constants';
import {
  VerifyIdmeButton,
  VerifyLogingovButton,
} from '~/platform/user/authentication/components/VerifyButton';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

import { VaAlertSignIn } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const AlertVerifyAndRegister = ({ cspId, recordEvent, testId }) => {
  const headline = 'Verify your identity';
  const variant = CSP_IDS.LOGIN_GOV ? 'verifyLoginGov' : 'verifyIdMe';
  const spanSlot =
    cspId === CSP_IDS.LOGIN_GOV ? (
      <span slot="LoginGovVerifyButton">
        <VerifyLogingovButton />
      </span>
    ) : (
      <span slot="IdMeVerifyButton">
        <VerifyIdmeButton />
      </span>
    );

  useEffect(
    () => {
      recordEvent({
        event: 'nav-alert-box-load',
        action: 'load',
        'alert-box-headline': headline,
        'alert-box-status': 'warning',
      });
    },
    [headline, recordEvent],
  );

  return (
    <VaAlertSignIn
      data-testid={testId}
      variant={variant}
      visible
      headingLevel={2}
    >
      {spanSlot}
    </VaAlertSignIn>
  );
};

AlertVerifyAndRegister.defaultProps = {
  cspId: CSP_IDS.LOGIN_GOV,
  recordEvent: recordEventFn,
  testId: 'mhv-alert--verify-and-register',
};

AlertVerifyAndRegister.propTypes = {
  cspId: PropTypes.oneOf([CSP_IDS.ID_ME, CSP_IDS.LOGIN_GOV]),
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertVerifyAndRegister;
