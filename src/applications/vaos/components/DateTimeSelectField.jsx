import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import CalendarWidget from './calendar/CalendarWidget';
import moment from 'moment';

const institutionTimezone = 'America/Denver';

class DateTimeSelectField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slotMap: {},
      avaialbleDatesArray: [],
    };
  }

  componentDidMount() {
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
  render() {
    return (
      <CalendarWidget
        monthsToShowAtOnce={2}
        multiSelect
        maxSelections={3}
        onChange={this.props.onChange}
        formData={this.props.formData}
        additionalOptions={{
          fieldName: 'optionTime',
          required: true,
          maxSelections: 2,
          validationMessage:
            'Please select a preferred time or unselect this date to continue',
          getOptionsByDate: () => [
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
    );
  }
}

DateTimeSelectField.propTypes = {};

export default DateTimeSelectField;
