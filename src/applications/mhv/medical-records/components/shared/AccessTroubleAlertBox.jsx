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
import FeedbackEmail from './FeedbackEmail';

const AccessTroubleAlertBox = props => {
  return (
    <VaAlert
      status={ALERT_TYPE_ERROR}
      visible
      class={`${props.className} vads-u-margin-top--4 vads-u-margin-bottom--9`}
    >
      <h2 slot="headline" data-testid="expired-alert-message">
        We can’t access your {props.alertType} records right now
      </h2>
      <p>We’re sorry. There’s a problem with our system. Check back later.</p>
      <p>
        If it still doesn’t work, email us at <FeedbackEmail />.
      </p>
    </VaAlert>
  );
};

export default AccessTroubleAlertBox;

AccessTroubleAlertBox.propTypes = {
  alertType: PropTypes.string.isRequired,
  className: PropTypes.any,
};
