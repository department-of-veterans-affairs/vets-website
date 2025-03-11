import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import VerifyAlert from '~/platform/user/authorization/components/VerifyAlert';
// eslint-disable-next-line import/no-named-default
import { default as recordEventFn } from '~/platform/monitoring/record-event';

const AlertVerifyAndRegister = ({ recordEvent, testId }) => {
  const headline = 'Verify your identity';

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

  return <VerifyAlert headingLevel={2} dataTestId={testId} />;
};

AlertVerifyAndRegister.defaultProps = {
  recordEvent: recordEventFn,
  testId: 'mhv-alert--verify-and-register',
};

AlertVerifyAndRegister.propTypes = {
  recordEvent: PropTypes.func,
  testId: PropTypes.string,
};

export default AlertVerifyAndRegister;
