import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { requestStates } from 'platform/utilities/constants';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { unsubscribe } from '../api';

import { focusElement } from 'platform/utilities/ui';

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

  let content = <LoadingIndicator message="Unsubscribing..." />;

  if (unsubscribeStatus === requestStates.failed) {
    content = (
      <div className="va-introtext">
        <p>Sorry, we were not able to unsubscribe you at this time.</p>
      </div>
    );
  } else if (unsubscribeStatus === requestStates.succeeded) {
    content = (
      <div className="va-introtext">
        <p>You have been unsubscribed from updates.</p>
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
