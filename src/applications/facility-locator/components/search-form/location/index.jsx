import React from 'react';
import PropTypes from 'prop-types';
import AddressAutosuggest from './AddressAutosuggest';
import { CurrentQueryTypes } from '../../../types';

const LocationInput = ({
  currentQuery,
  geolocateUser,
  handleClearInput,
  isMobile,
  isSmallDesktop,
  isTablet,
  locationInputFieldRef,
  onChange,
  useProgressiveDisclosure,
}) => {
  return (
    <AddressAutosuggest
      currentQuery={currentQuery}
      geolocateUser={geolocateUser}
      inputRef={locationInputFieldRef}
      isMobile={isMobile}
      isSmallDesktop={isSmallDesktop}
      isTablet={isTablet}
      onClearClick={handleClearInput}
      onChange={onChange}
      useProgressiveDisclosure={useProgressiveDisclosure}
    />
  );
};

LocationInput.propTypes = {
  currentQuery: CurrentQueryTypes,
  geolocateUser: PropTypes.func,
  handleClearInput: PropTypes.func,
  isMobile: PropTypes.bool,
  isSmallDesktop: PropTypes.bool,
  isTablet: PropTypes.bool,
  locationInputFieldRef: PropTypes.any,
  useProgressiveDisclosure: PropTypes.bool,
  onChange: PropTypes.func,
};

export default LocationInput;
