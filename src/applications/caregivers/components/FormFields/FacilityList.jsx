import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchFacilities } from '../../actions/fetchFacilities';
import { GeneralErrorAlert } from '../FormAlerts';

export const FacilityList = ({
  input,
  coordinates,
  formContext,
  id,
  onChange,
  value,
}) => {
  const { reviewMode, submitted } = formContext;
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, hasError] = useState(false);
  const [dirty, setDirty] = useState(false);

  const errorMessages = {
    required: 'Please select a facility',
  };

  const handleChange = event => {
    setDirty(true);
    onChange(event.detail.value);
  };

  const showError = () =>
    (submitted || dirty) && !value ? errorMessages.required : false;

  const getFacilityName = useCallback(
    val => facilities.find(f => f.id.split('_').pop() === val)?.name || '—',
    [facilities],
  );

  const formatAddress = ({ address1, address2, address3 }) => {
    // Create an array of address parts
    const parts = [address1, address2, address3];

    // Filter out falsy values (null, undefined, etc.)
    const validParts = parts.filter(part => part);

    // Join the valid parts with a comma and space
    return validParts.join(', ');
  };

  useEffect(
    () => {
      if (coordinates) {
        const fetchAndSetFacilities = async () => {
          setLoading(true);
          try {
            const fetchedFacilities = await fetchFacilities(coordinates);
            setFacilities(fetchedFacilities);
          } catch (err) {
            hasError(true);
          }
          setLoading(false);
        };

        fetchAndSetFacilities();
      }
    },
    [coordinates],
  );

  if (reviewMode) {
    return (
      <span data-testid="cg-facility-reviewmode">{getFacilityName(value)}</span>
    );
  }

  if (isLoading) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading available facilities..."
        set-focus
      />
    );
  }

  return !error ? (
    <div
      className="vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-color--gray-lighter"
      role="radiogroup"
      aria-labelledby="facility-list-heading"
    >
      <div className="vads-u-margin-top--1" id="facility-list-heading">
        Showing 1-
        {facilities.length} of {facilities.length} facilities for{' '}
        <b>"{input}"</b>
      </div>
      <VaRadio
        id={id}
        name={id}
        value={value}
        role="radio"
        onVaValueChange={handleChange}
        error={showError() || null}
        hint=""
        required
      >
        {facilities.map(facility => (
          <VaRadioOption
            key={facility.id}
            label={facility.attributes.name}
            name="facility"
            value={facility.id.split('_').pop()}
            description={formatAddress(facility.attributes.address.physical)}
            tile
          />
        ))}
      </VaRadio>
    </div>
  ) : (
    <GeneralErrorAlert />
  );
};

FacilityList.propTypes = {
  input: PropTypes.string,
  coordinates: PropTypes.array,
  formContext: PropTypes.object,
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string.isRequired,
};
