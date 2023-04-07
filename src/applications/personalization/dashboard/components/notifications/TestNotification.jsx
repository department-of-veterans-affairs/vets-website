import React from 'react';
import recordEvent from '~/platform/monitoring/record-event';
import CTALink from '../CTALink';

import './TestNotification.scss';

function handleNotification() {
  recordEvent({
    event: 'dashboard-navigation',
    'dashboard-action': 'view-link-from-notifications',
    'dashboard-product': 'view-manage-va-debt',
  });
}

const TestNotification = () => {
  return (
    <>
      <div
        className="onsite-notification vads-u-background-color--white vads-u-padding--2"
        role="alert"
      >
        <div className="vads-u-margin-top--0 vads-u-display--flex">
          <i
            aria-hidden="true"
            className="fas fa-exclamation-circle vads-u-color--secondary-darkest vads-u-font-size--xl
            vads-u-margin-right--1"
          />
          <div className="body" role="presentation">
            <h4 className="vads-u-margin-y--0">You have new debt. </h4>
            <div className="">Tuesday, March 4, 2023</div>

            <CTALink
              ariaLabel=""
              className="vads-u-margin-top--1 vads-u-font-weight--bold"
              text="Manage your VA debt"
              href="/manage-va-debt/your-debt"
              onClick={handleNotification}
              showArrow
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TestNotification;
