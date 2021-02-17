import React, { useState } from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import externalServiceStatus from '~/platform/monitoring/DowntimeNotification/config/externalServiceStatus';

/**
 * A simple React hook that returns a render method suitable for use as the
 * DowntimeNotification's `render` prop. The returned render method simply
 * displays a Modal if the soonest downtime will start within an hour. The hook
 * maintains its own  state to track if the Modal should be shown or not (which
 * is the only reason this needs to be a hook in the first place). This render
 * prop renders its children like normal if downtime is actually active.
 */
export default function useDowntimeApproachingRenderMethod() {
  const [modalDismissed, setModalDismissed] = useState(false);

  return (downtime, children) => {
    if (downtime.status === externalServiceStatus.downtimeApproaching) {
      return (
        <>
          <Modal
            id="downtime-approaching-modal"
            title="Some parts of your dashboard will be down for maintenance soon"
            status="info"
            onClose={() => {
              setModalDismissed(true);
            }}
            visible={!modalDismissed}
          >
            <p>
              We’ll be making updates to some tools and features on{' '}
              {downtime.startTime.format('MMMM Do')} between{' '}
              {downtime.startTime.format('LT')} and{' '}
              {downtime.endTime.format('LT')} If you have trouble using parts of
              the dashboard during that time, please check back soon.
            </p>
            <button
              type="button"
              className="usa-button-secondary"
              onClick={() => {
                setModalDismissed(true);
              }}
            >
              Continue
            </button>
          </Modal>
          {children}
        </>
      );
    }
    return children;
  };
}
