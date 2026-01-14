import React from 'react';

import PropTypes from 'prop-types';
import {
  VaTextInput,
  VaRadio,
  VaDate,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { TRIP_TYPES } from '../../../constants';

const ExpenseAirTravelFields = ({
  errors = {},
  formState,
  onChange,
  onBlur,
}) => (
  <>
    <div className="vads-u-margin-top--2">
      <VaTextInput
        label="Where did you purchase your ticket?"
        name="vendorName"
        value={formState.vendorName || ''}
        required
        onInput={onChange}
        onBlur={onBlur}
        hint="Enter the company you purchased the ticket from, even if it isn't an airline."
        {...errors.vendorName && { error: errors.vendorName }}
      />
    </div>
    <VaRadio
      name="tripType"
      value={formState.tripType || ''}
      label="Was your flight round trip or one way?"
      onVaValueChange={e => onChange(e.detail, 'tripType')}
      required
      {...errors.tripType && { error: errors.tripType }}
    >
      {Object.values(TRIP_TYPES).map(option => (
        <va-radio-option
          key={option.value}
          label={option.label}
          value={option.value}
          name="air-travel-trip-type-radio"
          checked={formState.tripType === option.value}
        />
      ))}
    </VaRadio>
    <div className="vads-u-margin-top--2">
      <VaDate
        label="Departure date"
        name="departureDate"
        value={formState.departureDate || ''}
        required
        onDateChange={onChange}
        onDateBlur={onBlur}
        hint="Enter the date on your departure ticket."
        {...errors.departureDate && { error: errors.departureDate }}
      />
    </div>
    <div className="vads-u-margin-top--2">
      <VaTextInput
        label="Departure airport"
        name="departedFrom"
        value={formState.departedFrom || ''}
        required
        onInput={onChange}
        onBlur={onBlur}
        {...errors.departedFrom && { error: errors.departedFrom }}
      />
    </div>
    <div className="vads-u-margin-top--2">
      <VaTextInput
        label="Arrival airport"
        name="arrivedTo"
        value={formState.arrivedTo || ''}
        required
        onInput={onChange}
        onBlur={onBlur}
        {...errors.arrivedTo && { error: errors.arrivedTo }}
      />
    </div>
    <VaDate
      label="Return date"
      name="returnDate"
      value={formState.returnDate || ''}
      required={formState.tripType === TRIP_TYPES.ROUND_TRIP.value}
      onDateChange={onChange}
      onDateBlur={onBlur}
      hint="Enter the date on your return ticket. For one-way trips, leave this blank."
      {...errors.returnDate && { error: errors.returnDate }}
    />
  </>
);

ExpenseAirTravelFields.propTypes = {
  errors: PropTypes.object,
  formState: PropTypes.object,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default ExpenseAirTravelFields;
