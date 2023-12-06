import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { requestStates } from 'platform/utilities/constants';

import { focusElement } from 'platform/utilities/ui';
import { unsubscribe } from '../api';

// Assumes URL is like /unsubscribe?sid={sid}
function Unsubscribe({ router }) {
  const subscriberId = router.location.query.sid;

  const [unsubscribeStatus, setUnsubscribeStatus] = useState(
    requestStates.notCalled,
  );

  useEffect(
    () => {
      focusElement('#covid-vaccination-heading-unsubscribe');
      async function unsubscribeBySid() {
        try {
          await unsubscribe(subscriberId);
          setUnsubscribeStatus(requestStates.succeeded);
        } catch (error) {
          setUnsubscribeStatus(requestStates.failed);
        }
      }
      if (subscriberId !== undefined) unsubscribeBySid();
      else setUnsubscribeStatus(requestStates.failed);
    },
    [subscriberId],
  );

  let content = <va-loading-indicator message="Unsubscribing..." />;

  if (unsubscribeStatus === requestStates.failed) {
    content = (
      <div className="va-introtext">
        <p>
          We're sorry. We couldn't unsubscribe you from COVID-19 vaccine updates
          at this time. Please try again later.
        </p>
      </div>
    );
  } else if (unsubscribeStatus === requestStates.succeeded) {
    content = (
      <div className="va-introtext">
        <p>
          You've unsubscribed from COVID-19 vaccine updates. We won't send you
          any more emails.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="no-outline" id="covid-vaccination-heading-unsubscribe">
        Unsubscribe
      </h1>{' '}
      {content}
    </>
  );
}

export default withRouter(Unsubscribe);

export { Unsubscribe };
