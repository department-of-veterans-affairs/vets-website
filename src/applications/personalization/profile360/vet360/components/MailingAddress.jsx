import React from 'react';
import PropTypes from 'prop-types';

import AddressSection from '../../components/AddressSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function MailingAddress({ addressConstants }) {
  return (
    <AddressSection
      title="Mailing address"
      fieldName={FIELD_NAMES.MAILING_ADDRESS}
      analyticsSectionName="mailing-address"
      deleteDisabled
      addressConstants={addressConstants}/>
  );
}

MailingAddress.propTypes = {
  addressProps: PropTypes.shape({
    states: PropTypes.array,
    countries: PropTypes.array
  })
};
