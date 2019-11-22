import React from 'react';
import PropTypes from 'prop-types';
import CalendarWidget from './calendar/CalendarWidget';
import moment from 'moment';

const DateTimeRequestField = ({ onChange, formData }) => (
  <CalendarWidget
    monthsToShowAtOnce={2}
    multiSelect
    maxSelections={3}
    onChange={onChange}
    minDate={moment()
      .add(5, 'days')
      .format('YYYY-MM-DD')}
    maxDate={moment()
      .add(395, 'days')
      .format('YYYY-MM-DD')}
    currentlySelectedDate={formData?.currentlySelectedDate}
    selectedDates={formData?.selectedDates}
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

DateTimeRequestField.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
};

export default DateTimeRequestField;
