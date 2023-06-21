import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { VaNotification } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import { dismissNotificationById } from '../../actions/notifications';

export const TestNotification = ({ notification, dismissNotification }) => {
  const [visible, setVisible] = useState(true);

  const createdAtFormatted = moment(notification.attributes.createdAt).format(
    'dddd, MMM DD, YYYY',
  );

  const closeNotification = () => {
    dismissNotification(notification.id);
    setVisible(false);
  };

  return (
    <DashboardWidgetWrapper>
      {visible && (
        <VaNotification
          data-testid="onsite-notification-card"
          closeBtnAriaLabel="Close notification"
          closeable
          onCloseEvent={closeNotification}
          has-border
          has-close-text
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
      )}
    </DashboardWidgetWrapper>
  );
};

TestNotification.propTypes = {
  dismissNotification: PropTypes.func.isRequired,
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      dismissed: PropTypes.bool.isRequired,
      templateId: PropTypes.string.isRequired,
      vaProfileId: PropTypes.string.isRequired,
    }),
  }),
};

const mapDispatchToProps = {
  dismissNotification: dismissNotificationById,
};

export default connect(
  null,
  mapDispatchToProps,
)(TestNotification);
