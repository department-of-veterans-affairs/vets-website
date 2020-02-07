import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import CalendarWidget from './calendar/CalendarWidget';
import { CALENDAR_INDICATOR_TYPES } from '../utils/constants';

const DateTimeRequestField = ({ onChange, formData, formContext }) => (
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
    selectedIndicatorType={CALENDAR_INDICATOR_TYPES.BUBBLES}
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
    validationError={formContext?.validationError}
  />
);

DateTimeRequestField.propTypes = {
  formData: PropTypes.object,
  onChange: PropTypes.func,
};

export default DateTimeRequestField;
