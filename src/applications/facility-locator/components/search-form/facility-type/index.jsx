import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { VaSelect } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  facilityTypesOptions,
  nonPPMSfacilityTypeOptions,
} from '../../../config';
import { CurrentQueryTypes } from '../../../types';

const FacilityType = ({
  currentQuery,
  handleFacilityTypeChange,
  suppressPPMS,
}) => {
  const { facilityType, isValid, facilityTypeChanged } = currentQuery;
  const locationOptions = suppressPPMS
    ? nonPPMSfacilityTypeOptions
    : facilityTypesOptions;
  const showError = !isValid && facilityTypeChanged && !facilityType;

  if (suppressPPMS) {
    delete locationOptions.pharmacy;
  }

  const options = Object.keys(locationOptions).map(facility => (
    <option key={facility} value={facility}>
      {locationOptions[facility]}
    </option>
  ));

  return (
    <div
      className={classNames(
        `facility-type-dropdown-val-${facilityType || 'none'}`,
      )}
    >
      <VaSelect
        required
        id="facility-type-dropdown"
        className={classNames('vads-u-width--full', {
          'vads-u-padding-left--1p5': showError,
        })}
        label="Facility type"
        value={facilityType || ''}
        onVaSelect={e => handleFacilityTypeChange(e)}
        error={showError ? 'Please choose a facility type.' : null}
      >
        {options}
      </VaSelect>
    </div>
  );
};

FacilityType.propTypes = {
  currentQuery: CurrentQueryTypes,
  handleFacilityTypeChange: PropTypes.func,
  suppressPPMS: PropTypes.bool,
};

export default FacilityType;
