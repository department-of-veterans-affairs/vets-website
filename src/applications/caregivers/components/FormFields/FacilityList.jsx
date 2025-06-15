import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { VaRadio, VaRadioOption } from '../../utils/imports';
import content from '../../locales/en/content.json';

const FacilityList = props => {
  const { error, facilities, formContext, onChange, query, value } = props;
  const { reviewMode = false, submitted = false } = formContext || {};

  const handleChange = useCallback(e => onChange(e.detail.value), [onChange]);

  const formatAddress = useCallback(
    ({ address1, address2, address3 }) =>
      [address1, address2, address3].filter(Boolean).join(', '),
    [],
  );

  const fieldError = useMemo(
    () =>
      error ||
      (submitted && !value
        ? content['validation-facilities--default-required']
        : null),
    [error, submitted, value],
  );

  const facilityName = useMemo(
    () => facilities.find(f => f.id === value)?.name || '&mdash;',
    [facilities, value],
  );

  const facilityOptions = useMemo(
    () =>
      facilities.map(f => (
        <VaRadioOption
          key={f.id}
          name="facility"
          label={f.name}
          value={f.id}
          description={formatAddress(f.address.physical)}
          tile
        />
      )),
    [facilities, formatAddress],
  );

  if (reviewMode) {
    return (
      <span
        className="dd-privacy-hidden"
        data-testid="cg-facility-name"
        data-dd-action-name="data value"
      >
        {facilityName}
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
        error={fieldError}
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
  formContext: PropTypes.shape({
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  query: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default FacilityList;
