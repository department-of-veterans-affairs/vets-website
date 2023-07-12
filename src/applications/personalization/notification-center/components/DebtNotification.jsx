import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { VaNotification } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const DebtNotification = ({ notification }) => {
  const createdAtFormatted = moment(notification.attributes.createdAt).format(
    'dddd, MMM DD, YYYY',
  );

  return (
    <VaNotification
      data-testid="notification-center-card"
      has-border
      headline="You have new debt."
      headline-level="3"
      href="/manage-va-debt/your-debt"
      symbol="action-required"
      text="Manage your VA debt"
      visible
      class="vads-u-margin-bottom--1p5"
    >
      <time
        slot="date"
        dateTime={moment(notification.attributes.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )}
      >
        {createdAtFormatted}
      </time>
    </VaNotification>
  );
};

DebtNotification.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      dismissed: PropTypes.bool,
      templateId: PropTypes.string.isRequired,
      vaProfileId: PropTypes.string.isRequired,
    }),
  }),
};

export default DebtNotification;
