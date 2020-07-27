import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { FETCH_STATUS } from '../utils/constants';
import FormButtons from '../components/FormButtons';

import * as actions from '../actions/expressCare';

export function ExpressCareFormPage({
  submitStatus,
  submitRequest,
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
        onBack={() =>
          routeToPreviousAppointmentPage(router, 'express-care-form')
        }
        onSubmit={() => submitRequest(router)}
      />
      {submitStatus === FETCH_STATUS.failed && (
        <AlertBox
          status="error"
          headline="Your request didn’t go through"
          content={
            <p>
              Something went wrong when we tried to submit your request and
              you’ll need to start over. We suggest you wait a day to try again
              or you can call your medical center to help with your request.
            </p>
          }
        />
      )}
    </div>
  );
}

const mapDispatchToProps = {
  submitRequest: actions.submitRequest,
  routeToPreviousAppointmentPage: actions.routeToPreviousAppointmentPage,
};

function mapStateToProps(state) {
  return state.expressCare;
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareFormPage);
