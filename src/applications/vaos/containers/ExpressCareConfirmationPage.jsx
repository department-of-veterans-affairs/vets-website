import React, { useEffect } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import recordEvent from 'platform/monitoring/record-event';
import { scrollAndFocus } from '../utils/scrollAndFocus';
import { GA_PREFIX } from '../utils/constants';
import {
  startNewAppointmentFlow,
  fetchFacilityDetails,
} from '../actions/newAppointment';
import { transformPendingAppointments } from '../services/appointment/transformers';
import ExpressCareCard from '../components/ExpressCareCard';

const pageTitle = 'You’ve successfully submitted your Express Care request';

function ExpressCareConfirmationPage({ successfulRequest, router }) {
  useEffect(
    () => {
      document.title = `${pageTitle} | Veterans Affairs`;

      if (!successfulRequest) {
        router.replace('/new-express-care-request');
      }

      scrollAndFocus();
    },
    [successfulRequest, router],
  );

  if (!successfulRequest) {
    return null;
  }

  const transformedRequest = transformPendingAppointments([
    successfulRequest,
  ])[0];

  return (
    <div>
      <h1 className="vads-u-font-size--h2 vads-u-margin-bottom--4">
        {pageTitle}
      </h1>
      <ExpressCareCard headingLevel="2" appointment={transformedRequest} />
      <div className="vads-u-margin-y--2">
        <Link
          to="/express-care"
          className="usa-button vads-u-padding-right--2"
          onClick={() => {
            recordEvent({
              event: `${GA_PREFIX}-express-care-view-your-appointments-button-clicked`,
            });
          }}
        >
          View your appointments
        </Link>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    successfulRequest: state.expressCare.successfulRequest,
  };
}

const mapDispatchToProps = {
  startNewAppointmentFlow,
  fetchFacilityDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpressCareConfirmationPage);
