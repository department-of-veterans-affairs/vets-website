import React from 'react';
import { connect } from 'react-redux';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
// import SchemaForm from 'platform/forms-system/src/js/components/SchemaForm';
// import FormButtons from '../components/FormButtons';
import Calendar from './../components/calendar/CalendarWidget';
import { getFormPageInfo } from '../utils/selectors';

const pageKey = 'dateTimeRequest';

export class DateTimeRequestPage extends React.Component {
  goBack = () => {
    this.props.routeToPreviousAppointmentPage(this.props.router, pageKey);
  };

  goForward = () => {
    this.props.routeToNextAppointmentPage(this.props.router, pageKey);
  };

  render() {
    return (
      <div className="vaos-form__detailed-radio">
        <h1 className="vads-u-font-size--h2">
          What date and time would you like to make an appointment?
        </h1>
        <Calendar
          monthsToShowAtOnce={2}
          multiSelect
          maxSelections={3}
          additionalOptions={{
            fieldName: 'optionTime',
            options: [
              {
                value: 'AM',
                label: 'AM',
              },
              {
                value: 'PM',
                label: 'PM',
              },
            ],
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return getFormPageInfo(state, pageKey);
}

const mapDispatchToProps = {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DateTimeRequestPage);
