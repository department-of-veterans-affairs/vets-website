import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import { dismissNotificationById } from '../../actions/notifications';
import '../../sass/user-profile.scss';

export const DebtNotification = ({ notification, dismissNotification }) => {
  const createdAtFormatted = moment(notification.attributes.createdAt).format(
    'dddd, MMM DD, YYYY',
  );

  return (
    <DashboardWidgetWrapper>
      <div
        data-testid="dashboard-notification-alert"
        className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-top--2p5"
      >
        <VaAlert
          status="warning"
          show-icon
          className="vads-u-margin-top--0"
          onCloseEvent={() => dismissNotification(notification.id)}
          closeable
        >
          <div className="vads-u-margin-top--0">
            <span className="vads-u-font-weight--bold">
              You have new debt.{' '}
            </span>
            <CTALink
              text="Manage your VA debt"
              href="/manage-va-debt/your-debt"
              onClick={() =>
                recordEvent({
                  event: 'profile-navigation',
                  'profile-action': 'view-link',
                  'profile-section': 'view-manage-va-debt',
                })
              }
            />
          </div>
          <div className="vads-u-margin-top--0">{createdAtFormatted}</div>
        </VaAlert>
      </div>
    </DashboardWidgetWrapper>
  );
};

DebtNotification.propTypes = {
  dismissNotification: PropTypes.func.isRequired,
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    attributes: PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      dismissed: PropTypes.bool.isRequired,
      templateId: PropTypes.string.isRequired,
      updatedAt: PropTypes.string,
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
)(DebtNotification);
