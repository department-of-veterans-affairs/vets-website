import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { VaNotification } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { dismissNotificationById } from '../../../common/actions/notifications';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';

/*
 * This component uses the va-notification web component
 * and is more updated than DebtNotificationAlert
 */

export const TestNotification = ({ notification, dismissNotification }) => {
  const [visible, setVisible] = useState(true);

  const createdAtFormatted = format(
    new Date(notification.attributes.createdAt),
    'EEEE, MMM dd, yyyy',
  );

  const closeNotification = () => {
    dismissNotification(notification.id);
    setVisible(false);
  };

  return (
    <DashboardWidgetWrapper>
      <VaNotification
        data-testid="onsite-notification-card"
        closeBtnAriaLabel="Close notification"
        closeable
        onCloseEvent={closeNotification}
        has-border
        has-close-text
        headline="You have new debt."
        headline-level="3"
        date-time={createdAtFormatted}
        href="/manage-va-debt/summary/debt-balances"
        symbol="action-required"
        text="Manage your VA debt"
        visible={visible}
        class="vads-u-margin-bottom--1p5"
      />
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

export default connect(null, mapDispatchToProps)(TestNotification);
