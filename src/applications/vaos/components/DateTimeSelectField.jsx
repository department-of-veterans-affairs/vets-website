import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CalendarWidget from './calendar/CalendarWidget';
import moment from 'moment';

class DateTimeSelectField extends Component {
  static propTypes = {
    formContext: PropTypes.object,
    formData: PropTypes.object,
    onChange: PropTypes.func,
  };

  getOptionsByDate = selectedDate => {
    const availableSlots = this.props.formContext.availableSlots || [];
    const options = availableSlots.reduce((acc, slot) => {
      if (slot.date === selectedDate) {
        acc.push({
          value: slot.datetime,
          label: moment(slot.datetime).format('h:mm A'),
        });
      }
      return acc;
    }, []);

    return options;
  };

  render() {
    const { formContext, formData } = this.props;
    const { currentlySelectedDate, selectedDates } = formData;

    const startMonth = formContext?.preferredDate
      ? moment(formContext.preferredDate).format('YYYY-MM')
      : null;

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
        minDate={moment()
          .add(1, 'days')
          .format('YYYY-MM-DD')}
        maxDate={moment()
          .add(395, 'days')
          .format('YYYY-MM-DD')}
        startMonth={startMonth}
      />
    );
  }
}

DateTimeSelectField.propTypes = {};

export default DateTimeSelectField;
