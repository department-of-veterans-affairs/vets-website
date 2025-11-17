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
      onInput={onChange}
      hint="Enter the company you purchased the ticket from, even if it isn't an airline."
    />

    <VaRadio
      name="tripType"
      value={formState.tripType || ''}
      label="Type of trip"
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
      onDateChange={onChange}
      hint="Enter the date on your departure ticket."
    />
    <VaTextInput
      label="Departure airport"
      name="departedFrom"
      value={formState.departedFrom || ''}
      required
      onInput={onChange}
    />
    <VaTextInput
      label="Arrival airport"
      name="arrivedTo"
      value={formState.arrivedTo || ''}
      required
      onInput={onChange}
    />
    <VaDate
      label="Return date"
      name="returnDate"
      value={formState.returnDate || ''}
      onDateChange={onChange}
      hint="Enter the date on your return ticket. For one-way trips, leave this blank."
    />
  </>
);

ExpenseAirTravelFields.propTypes = {
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseAirTravelFields;
