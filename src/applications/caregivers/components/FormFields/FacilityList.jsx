import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  VaRadio,
  VaRadioOption,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import content from '../../locales/en/content.json';

const FacilityList = props => {
  const { facilities, onChange, query, value, error } = props;
  const reviewMode = props?.formContext?.reviewMode || false;
  const submitted = props?.formContext?.submitted || false;

  const handleChange = e => {
    onChange(e.detail.value);
  };

  const showError = () => {
    if (error) {
      return error;
    }

    return submitted && !value
      ? content['validation-facilities--default-required']
      : null;
  };

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
      className="vads-u-margin-top--2"
      aria-labelledby="facility-list-heading"
    >
      <div
        className="vads-u-margin-top--1 vads-u-padding-bottom--1 vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
        id="caregiver_facility_results"
      >
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
        label={content['vet-med-center-label']}
        labelHeaderLevel="4"
      >
        {facilityOptions}
      </VaRadio>
    </div>
  );
};

FacilityList.propTypes = {
  error: PropTypes.string,
  facilities: PropTypes.array,
  formContext: PropTypes.object,
  query: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default FacilityList;
