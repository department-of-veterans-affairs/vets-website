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
      hint="If you didn’t purchase the ticket(s) directly from an airline, enter the company you purchased the ticket from."
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
      hint="For round trip flights, enter the departure date of your first flight."
    />
    <VaTextInput
      label="Departure airport"
      name="departureAirport"
      value={formState.departureAirport || ''}
      required
      onInput={onChange}
      hint="For round trip flights, enter the departure airport of your first flight."
    />
    <VaTextInput
      label="Arrival airport"
      name="arrivalAirport"
      value={formState.arrivalAirport || ''}
      required
      onInput={onChange}
    />
    <VaDate
      label="Return date"
      name="returnDate"
      value={formState.returnDate || ''}
      onDateChange={onChange}
    />
  </>
);

ExpenseAirTravelFields.propTypes = {
  formState: PropTypes.object,
  onChange: PropTypes.func,
};

export default ExpenseAirTravelFields;
