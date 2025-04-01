import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import CTALink from '../CTALink';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import { dismissNotificationById } from '../../../common/actions/notifications';

/*
 * This component uses the va-alert web component 
 * and can be deleted once we remove the feature toggle
 */

export const DebtNotificationAlert = ({
  notification,
  dismissNotification,
}) => {
  const createdAtFormatted = format(
    new Date(notification.attributes.createdAt),
    'EEEE, MMM dd, yyyy',
  );

  return (
    <DashboardWidgetWrapper>
      <div
        data-testid="dashboard-notification-alert"
        className="vads-u-display--flex vads-u-flex-direction--column desktop-lg:vads-u-flex--1 vads-u-margin-top--2p5"
      >
        <VaAlert
          status="warning"
          show-icon
          className="vads-u-margin-top--0"
          onCloseEvent={() => dismissNotification(notification.id)}
          closeBtnAriaLabel="Close notification"
          closeable
        >
          <div className="vads-u-margin-top--0">
            <span className="vads-u-font-weight--bold">
              You have new debt.{' '}
            </span>
            <CTALink
              text="Manage your VA debt"
              href="/manage-va-debt/summary/debt-balances"
              onClick={() =>
                recordEvent({
                  event: 'dashboard-navigation',
                  'dashboard-action': 'view-link-from-notifications',
                  'dashboard-product': 'view-manage-va-debt',
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

DebtNotificationAlert.propTypes = {
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
)(DebtNotificationAlert);
