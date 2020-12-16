import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { requestStates } from 'platform/utilities/constants';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';

import { unsubscribe } from '../api';

import { focusElement } from 'platform/utilities/ui';

// Assumes URL is like /unsubscribe/{sid}
function Unsubscribe({ params }) {
  const sid = { sid: params.sid };

  const [unsubscribeStatus, setUnsubscribeStatus] = useState(
    requestStates.notCalled,
  );

  useEffect(() => {
    focusElement('#covid-vaccination-heading-unsubscribe');
    async function unsubscribeBySid() {
      try {
        await unsubscribe(sid);
        setUnsubscribeStatus(requestStates.succeeded);
      } catch (error) {
        setUnsubscribeStatus(requestStates.failed);
      }
    }
    unsubscribeBySid();
  }, []);

  if (
    unsubscribeStatus === requestStates.pending ||
    unsubscribeStatus === requestStates.notCalled
  ) {
    return <LoadingIndicator message="Unsubscribing..." />;
  }
  return (
    <>
      <h1 className="no-outline" id="covid-vaccination-heading-unsubscribe">
        Unsubscribe
      </h1>
      {unsubscribeStatus === requestStates.failed ? (
        <div className="va-introtext">
          <p>Sorry, we were not able to unsubscribe you at this time.</p>
        </div>
      ) : null}
      {unsubscribeStatus === requestStates.succeeded ? (
        <div className="va-introtext">
          <p>You have been unsubscribed from updates.</p>
        </div>
      ) : null}
    </>
  );
}

const mapStateToProps = state => {
  return {
    formData: state.coronavirusVaccinationApp.formState?.formData,
  };
};

const mapDispatchToProps = {};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Unsubscribe),
);

export { Unsubscribe };
