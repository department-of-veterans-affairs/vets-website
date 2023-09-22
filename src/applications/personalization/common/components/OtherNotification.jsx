import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { VaNotification } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const OtherNotification = ({ notification }) => {
  const createdAtFormatted = moment(notification.attributes.createdAt).format(
    'dddd, MMM DD, YYYY',
  );

  return (
    <VaNotification
      data-testid="notification-center-card"
      has-border
      headline="Your claim status has been updated."
      headline-level="3"
      href="/track-claims/your-claims"
      symbol="update"
      text="Manage your claims and appeals"
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

OtherNotification.propTypes = {
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

export default OtherNotification;
