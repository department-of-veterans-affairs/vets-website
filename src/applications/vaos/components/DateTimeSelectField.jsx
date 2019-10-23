import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import CalendarWidget from './calendar/CalendarWidget';
import moment from 'moment';

class DateTimeSelectField extends Component {
  getOptionsByDate = selectedDate => {
    const options = [];
    const availableSlots = this.props.formContext.availableSlots;
    for (let index = 0; index < availableSlots.length; index++) {
      const slot = availableSlots[index];
      if (slot.date === selectedDate) {
        options.push({
          value: slot.datetime,
          label: moment(slot.datetime).format('h:mm A'),
        });
      }
    }

    return options;
  };

  render() {
    const { formContext, formData } = this.props;
    const { currentlySelectedDate, selectedDates } = formData;

    return (
      <CalendarWidget
        monthsToShowAtOnce={2}
        maxSelections={1}
        availableDates={formContext?.availableDates}
        currentlySelectedDate={currentlySelectedDate}
        selectedDates={selectedDates}
        additionalOptions={{
          fieldName: 'datetime',
          required: true,
          maxSelections: 1,
          getOptionsByDate: this.getOptionsByDate,
        }}
        onChange={this.props.onChange}
      />
    );
  }
}

DateTimeSelectField.propTypes = {};

export default DateTimeSelectField;
