import React from 'react';
import PropTypes from 'prop-types';

import AddressSection from '../../components/AddressSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function ResidentialAddress({ addressConstants }) {
  return (
    <AddressSection
      title="Home address"
      fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
      analyticsSectionName="home-address"
      addressConstants={addressConstants}/>
  );
}

ResidentialAddress.propTypes = {
  addressConstants: PropTypes.shape({
    states: PropTypes.arrayOf(PropTypes.string),
    countries: PropTypes.arrayOf(PropTypes.string)
  })
};
