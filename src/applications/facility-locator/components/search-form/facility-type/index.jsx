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
  isMobile,
  isSmallDesktop,
  isTablet,
  suppressPPMS,
  useProgressiveDisclosure,
}) => {
  const { facilityType, isValid, facilityTypeChanged } = currentQuery;
  const locationOptions = suppressPPMS
    ? nonPPMSfacilityTypeOptions
    : facilityTypesOptions;
  const showError = !isValid && facilityTypeChanged && !facilityType;

  const options = Object.keys(locationOptions).map(facility => (
    <option key={facility} value={facility}>
      {locationOptions[facility]}
    </option>
  ));

  return (
    <div
      className={classNames(
        'input-clear',
        `facility-type-dropdown-val-${facilityType || 'none'}`,
        {
          'facility-type-dropdown': !useProgressiveDisclosure,
          'facility-type-dropdown-mobile': isMobile && useProgressiveDisclosure,
          'facility-type-dropdown-tablet': isTablet && useProgressiveDisclosure,
          'facility-type-dropdown-desktop':
            isSmallDesktop && useProgressiveDisclosure,
          'facility-error': showError,
        },
      )}
      data-testid="facility-type"
    >
      <VaSelect
        key={showError ? 'select-with-error' : 'select-without-error'}
        required
        id="facility-type-dropdown"
        className={
          showError ? `vads-u-padding-left--1p5 vads-u-padding-top--1p5` : null
        }
        label="Facility type"
        hint="Select a facility type"
        value={facilityType || ''}
        onVaSelect={e => handleFacilityTypeChange(e)}
        error={showError ? 'Select a facility type' : null}
      >
        {options}
      </VaSelect>
    </div>
  );
};

FacilityType.propTypes = {
  currentQuery: CurrentQueryTypes,
  handleFacilityTypeChange: PropTypes.func,
  isMobile: PropTypes.bool,
  isSmallDesktop: PropTypes.bool,
  isTablet: PropTypes.bool,
  suppressPPMS: PropTypes.bool,
  useProgressiveDisclosure: PropTypes.bool,
};

export default FacilityType;
