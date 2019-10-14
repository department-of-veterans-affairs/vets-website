import React from 'react';
import { connect } from 'react-redux';
import {
  openFormPage,
  updateFormData,
  routeToNextAppointmentPage,
  routeToPreviousAppointmentPage,
} from '../actions/newAppointment.js';
import { getFormPageInfo } from '../utils/selectors';
import slots from './../api/slots.json';
import Calendar from './../components/calendar/CalendarWidget';
import { focusElement } from 'platform/utilities/ui';
import moment from 'moment-timezone';

const pageKey = 'dateTimeSelect';

const institutionTimezone = 'America/Denver';

export class DateTimeSelectPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      slotMap: {},
      avaialbleDatesArray: [],
    };
  }

  componentDidMount() {
    focusElement('h1.vads-u-font-size--h2');
    this.mapSlots();
  }

  getSelectedDateOptions = selectedDate => {
    const data = this.state.slotMap[selectedDate];
    if (data?.times?.length) {
      return data.times.map(t => ({
        value: t.format(),
        label: t.format('h:mm A z'),
      }));
    }

    return null;
  };

  mapSlots = () => {
    const availableSlots = this.props.availableSlots[0].appointmentTimeSlot;
    const slotMap = {};
    const availableDatesArray = [];
    const now = moment();
    for (let index = 0; index < availableSlots.length; index++) {
      const slot = availableSlots[index];
      let dateObj = moment(slot.startDateTime, 'MM/DD/YYYY LTS');
      dateObj = dateObj.tz(institutionTimezone);

      if (dateObj.isAfter(now)) {
        const dateString = dateObj.format('YYYY-MM-DD');
        if (!availableDatesArray.includes(dateString)) {
          availableDatesArray.push(dateString);
        }
        if (slotMap[dateString]) {
          slotMap[dateString].times.push(dateObj);
        } else {
          slotMap[dateString] = {
            times: [dateObj],
          };
        }
      }
    }

    this.setState({
      slotMap,
      availableDatesArray,
    });
  };

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
          availableDates={this.state.availableDatesArray}
          monthsToShowAtOnce={2}
          maxSelections={1}
          additionalOptions={{
            fieldName: 'datetime',
            required: true,
            maxSelections: 1,
            getOptionsByDate: this.getSelectedDateOptions,
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { ...getFormPageInfo(state, pageKey), availableSlots: slots };
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
)(DateTimeSelectPage);
