import React from 'react';
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
import ExpressCareListItem from '../components/ExpressCareListItem';

const pageTitle = 'Your Express Care request has been submitted';

export class ExpressCareConfirmationPage extends React.Component {
  componentDidMount() {
    document.title = `${pageTitle} | Veterans Affairs`;

    const { data, router } = this.props;
    // Check formData for typeOfCareId. Reroute if empty
    if (router && !data?.reasonForVisit) {
      router.replace('/new-express-care-request');
    }

    scrollAndFocus();
  }

  render() {
    const { successfulRequest } = this.props;
    const transformedRequest = transformPendingAppointments([
      successfulRequest,
    ])[0];

    return (
      <div>
        <h1 className="vads-u-font-size--h2">{pageTitle}</h1>
        <ExpressCareListItem index="1" appointment={transformedRequest} />
        <div className="vads-u-margin-y--2">
          <Link
            to="/express-care"
            className="usa-button vads-u-padding-right--2"
            onClick={() => {
              recordEvent({
                event: `${GA_PREFIX}-view-your-appointments-button-clicked`,
              });
            }}
          >
            View your appointments
          </Link>
        </div>
      </div>
    );
  }
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
