import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { focusElement } from 'platform/utilities/ui';
import content from '../../locales/en/content.json';

const FacilityList = props => {
  const { facilities, formContext, onChange, query, value } = props;
  const { reviewMode, submitted } = formContext;

  const [dirty, setDirty] = useState(false);

  const handleChange = e => {
    onChange(e.detail.value);
    setDirty(true);
  };

  const showError = () =>
    (submitted || dirty) && !value
      ? content['validation-facialities--default-required']
      : null;

  const getFacilityName = useCallback(
    val => {
      const facility = facilities.find(f => f.id === val);
      return facility?.name || '&mdash;';
    },
    [facilities],
  );

  const formatAddress = ({ address1, address2, address3 }) => {
    const parts = [address1, address2, address3];
    const validParts = parts.filter(Boolean);
    return validParts.join(', ');
  };

  const facilityOptions = facilities.map(facility => (
    <VaRadioOption
      key={facility.id}
      name="facility"
      label={facility.name}
      value={facility.id}
      description={formatAddress(facility.address.physical)}
      tile
    />
  ));

  useEffect(
    () => {
      focusElement('#caregiver_facility_results');
    },
    [facilities],
  );

  if (reviewMode) {
    return (
      <span
        className="dd-privacy-hidden"
        data-testid="cg-facility-name"
        data-dd-action-name="data value"
      >
        {getFacilityName(value)}
      </span>
    );
  }

  return (
    <div
      role="radiogroup"
      className="vads-u-margin-top--2 vads-u-border-top--1px vads-u-border-color--gray-lighter"
      aria-labelledby="facility-list-heading"
    >
      <div className="vads-u-margin-top--1" id="caregiver_facility_results">
        Showing 1-
        {facilities.length} of {facilities.length} facilities for{' '}
        <strong>“{query}”</strong>
      </div>
      <VaRadio
        id="root_facility_search_list"
        name="root_facility_search_list"
        value={value}
        onVaValueChange={handleChange}
        error={showError()}
        required
      >
        {facilityOptions}
      </VaRadio>
    </div>
  );
};

FacilityList.propTypes = {
  facilities: PropTypes.array,
  formContext: PropTypes.object,
  query: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default FacilityList;
