import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import recordEvent from '~/platform/monitoring/record-event';
import CTALink from '../CTALink';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import { dismissNotificationById } from '../../actions/notifications';

function handleNotification() {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': 'view-link-from-notifications',
    'dashboard-product': 'view-manage-va-debt',
  });
}

export const TestNotification = ({ notification, dismissNotification }) => {
  const [visible, setVisible] = useState(true);

  const createdAtFormatted = moment(notification.attributes.createdAt).format(
    'dddd, MMM DD, YYYY',
  );

  const closeNotification = () => {
    dismissNotification(notification.id);
    setVisible(open => !open);
  };

  return (
    <DashboardWidgetWrapper>
      {visible && (
        <div
          data-testid="onsite-notification-card"
          className="onsite-notification vads-u-background-color--white vads-u-padding--2 vads-u-margin-bottom--2p5"
          role="alert"
        >
          <div className="vads-u-margin-top--0 vads-u-display--flex">
            <i
              aria-hidden="true"
              className="fas fa-exclamation-circle vads-u-color--secondary-darkest vads-u-font-size--xl
            vads-u-margin-right--1"
            />
            <div className="body" role="presentation">
              <h3 className="vads-u-margin-y--0 vads-u-font-size--md">
                You have new debt.
              </h3>
              <div className="">{createdAtFormatted}</div>

              <CTALink
                ariaLabel=""
                className="vads-u-margin-top--1 vads-u-font-weight--bold"
                text="Manage your VA debt"
                href="/manage-va-debt/your-debt"
                onClick={handleNotification}
                showArrow
              />
            </div>
            <button
              className="onsite-notification-close"
              aria-label="Close notification"
              type="button"
              onClick={closeNotification}
            >
              <i
                aria-hidden="true"
                className="fas fa-times-circle vads-u-margin-right--1"
                role="presentation"
              />
              <span>CLOSE</span>
            </button>
          </div>
        </div>
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
