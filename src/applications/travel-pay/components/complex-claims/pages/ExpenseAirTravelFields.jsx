import React from 'react';

import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaRadio,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TRIP_TYPES } from '../../../constants';

const ExpenseAirTravelFields = ({ formState, onChange }) => (
  <>
    <VaTextInput
      label="Where did you purchase your ticket?"
      name="vendorName"
      value={formState.vendorName || ''}
      required
      onBlur={onChange}
      hint="Enter the company you purchased the ticket from, even if it isn't an airline."
    />

    <VaRadio
      name="tripType"
      value={formState.tripType || ''}
      label="Was your flight round trip or one way?"
      onVaValueChange={e => onChange(e.detail, 'tripType')}
      required
    >
      {Object.values(TRIP_TYPES).map(option => (
        <va-radio-option
          key={option.label}
          label={option.label}
          value={option.label}
          checked={formState.tripType === option.label}
        />
      ))}
    </VaRadio>

    <VaDate
      label="Departure date"
      name="departureDate"
      value={formState.departureDate || ''}
      required
      onDateChange={onChange} // Needed since we need to remove errors on change
      onDateBlur={onChange}
      hint="Enter the date on your departure ticket."
    />
    <VaTextInput
      label="Departure airport"
      name="departedFrom"
      value={formState.departedFrom || ''}
      required
      onBlur={onChange}
    />
    <VaTextInput
      label="Arrival airport"
      name="arrivedTo"
      value={formState.arrivedTo || ''}
      required
      onBlur={onChange}
    />
    <VaDate
      label="Return date"
      name="returnDate"
      value={formState.returnDate || ''}
      onDateChange={onChange} // Needed since we need to remove errors on change
      onDateBlur={onChange}
      hint="Enter the date on your return ticket. For one-way trips, leave this blank."
    />
  </>
);

ExpenseAirTravelFields.propTypes = {
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseAirTravelFields;
