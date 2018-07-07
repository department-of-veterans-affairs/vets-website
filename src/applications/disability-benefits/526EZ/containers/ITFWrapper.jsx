import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '@department-of-veterans-affairs/formation/LoadingIndicator';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

import { requestStates } from '../../../../platform/utilities/constants';
import { itfStatuses } from '../constants';
import { createITF as createITFAction, fetchITF as fetchITFAction } from '../actions';


const fetchWaitingStates = [requestStates.notCalled, requestStates.pending];


export const ITFWrapper = ({ location, children, itf, fetchITF, createITF }) => {
  // If the location is the intro or confirmation pages, don't fetch an ITF
  if (['/introduction', '/confirmation'].includes(location.pathname)) {
    return children;
  }

  // If we haven't checked the ITF status yet, do so
  if (itf.fetchCallState === requestStates.notCalled) {
    fetchITF();
  }

  // While we're waiting, show the loading indicator...
  if (fetchWaitingStates.includes(itf.fetchCallState)) {
    return <LoadingIndicator message="Checking your Intent to File status..."/>;
  }

  // We'll get here after the fetchITF promise is fulfilled

  if (itf.fetchCallState === requestStates.failed) {
    // TODO: Get better content for this content
    return (
      <div className="usa-grid" style={{ marginBottom: '2em' }}>
        <AlertBox
          isVisible
          headline="Something went wrong"
          content="Sorry, we’re unable to check your ITF status right now."
          status="error"/>
      </div>
    );
  }

  // If we have an active ITF, we're good to go--render that form!
  if (itf.currentITF.status === itfStatuses.active) {
    // TODO: Render a success alert box (only the first time)
    return children;
  }

  // If not, try to submit a new ITF
  if (itf.creationCallState === requestStates.notCalled) {
    createITF();
  }

  // While we're waiting (again), show the loading indicator...again
  if (fetchWaitingStates.includes(itf.creationCallState)) {
    return <LoadingIndicator message="Submitting a new Intent to File..."/>;
  }

  // We'll get here after the createITF promise is fulfilled and we have no active ITF
  //  because of a failed creation call
  // TODO: Get better content for this content
  return (
    <div className="usa-grid" style={{ marginBottom: '2em' }}>
      <AlertBox
        isVisible
        headline="Something went wrong"
        content="We’re sorry, we couldn’t find an active ITF nor file a new one for you. Please try again later."
        status="error"/>
    </div>
  );
};


const mapStateToProps = (store) => ({
  itf: store.itf
});

const mapDispatchToProps = {
  createITF: createITFAction,
  fetchITF: fetchITFAction
};

export default connect(mapStateToProps, mapDispatchToProps)(ITFWrapper);
