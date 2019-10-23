import React from 'react';
import CalendarWidget from './calendar/CalendarWidget';

const DateTimeRequestField = ({ onChange, formData }) => (
  <CalendarWidget
    monthsToShowAtOnce={2}
    multiSelect
    maxSelections={3}
    onChange={onChange}
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
      legend: 'Do you prefer a morning (AM) or an afternoon (PM) appointment?',
    }}
  />
);

export default DateTimeRequestField;
