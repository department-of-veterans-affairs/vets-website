import React from 'react';
import PropTypes from 'prop-types';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import '../../sass/user-profile.scss';

export const DebtNotification = ({ notification }) => {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) {
    return null;
  }

  return (
    <DashboardWidgetWrapper>
      <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-top--2p5">
        <va-alert
          status="warning"
          show-icon
          className="vads-u-margin-top--0"
          onCloseEvent={() => setDismissed(true)}
          closeable
        >
          <div className="vads-u-margin-top--0">
            You have new debt as of {notification.attributes.createdAt}.{' '}
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
        </va-alert>
      </div>
    </DashboardWidgetWrapper>
  );
};

DebtNotification.propTypes = {
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

export default DebtNotification;
