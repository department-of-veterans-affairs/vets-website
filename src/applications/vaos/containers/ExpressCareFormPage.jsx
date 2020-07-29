import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FETCH_STATUS, EXPRESS_CARE_ERROR_REASON } from '../utils/constants';
import FormButtons from '../components/FormButtons';

import * as actions from '../actions/expressCare';

function ExpressCareFormPage({
  submitStatus,
  submitErrorReason,
  localWindowString,
  submitExpressCareRequest,
  router,
  routeToPreviousAppointmentPage,
}) {
  return (
    <div>
      <h1>Express Care form</h1>
      <FormButtons
        backBeforeText=""
        backButtonText="Back"
        nextButtonText="Submit Express Care request"
        pageChangeInProgress={submitStatus === FETCH_STATUS.loading}
        disabled={submitStatus === FETCH_STATUS.failed}
        loadingText="Submitting your Express Care request"
        onBack={() => routeToPreviousAppointmentPage(router, 'form')}
        onSubmit={() => submitExpressCareRequest(router)}
      />
      {submitStatus === FETCH_STATUS.failed && (
        <>
          {submitErrorReason === EXPRESS_CARE_ERROR_REASON.error && (
            <AlertBox
              status="error"
              headline="Your request didn’t go through"
              content={
                <p>
                  Something went wrong when we tried to submit your request and
                  you’ll need to start over. We suggest you wait a day to try
                  again or you can call your medical center to help with your
                  request.
                </p>
              }
            />
          )}
          {submitErrorReason === EXPRESS_CARE_ERROR_REASON.noActiveFacility && (
            <AlertBox
              status="error"
              headline="Express Care isn’t available right now"
              content={
                <p>
                  Express Care is only available {localWindowString} today. To
                  use Express Care, check back during the time shown above.
                </p>
              }
            />
          )}
        </>
      )}
    </div>
  );
}

const mapDispatchToProps = {
  submitExpressCareRequest: actions.submitExpressCareRequest,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

function mapStateToProps(state) {
  return state.expressCare;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareFormPage);
