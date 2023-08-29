/**
 * Alert Box component specific to access trouble
 *
 * @author Matthew Wright
 * @desc: Alert that displays an access trouble message with embedded phone link
 * @notes :
 */

import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import { ALERT_TYPE_ERROR } from '../../util/constants';

const AccessTroubleAlertBox = props => {
  return (
    <VaAlert
      status={ALERT_TYPE_ERROR}
      visible
      class={`${props.className} vads-u-margin-top--4 set-width-486`}
    >
      <h2 slot="headline" data-testid="expired-alert-message">
        We are having trouble accessing your records
      </h2>
      <p>
        We’re sorry. Something went wrong when we tried to access your records.
        Please try again. If you still can’t access your records, call us at{' '}
        <va-telephone contact="8006982411" /> (
        <va-telephone contact="711" tty />
        ). We’re here 24/7.
      </p>
    </VaAlert>
  );
};

export default AccessTroubleAlertBox;

AccessTroubleAlertBox.propTypes = {
  className: PropTypes.any,
};
