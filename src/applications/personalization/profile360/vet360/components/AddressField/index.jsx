import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';

import {
  API_ROUTES,
  FIELD_NAMES
} from '../../constants';

import { MILITARY_STATES } from '../../../../../letters/utils/constants';

import Vet360ProfileField from '../../containers/ProfileField';

import AddressEditModal from './EditModal';
import AddressView from './View';

export default class AddressField extends React.Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    deleteDisabled: PropTypes.bool,
    fieldName: PropTypes.oneOf([
      FIELD_NAMES.MAILING_ADDRESS,
      FIELD_NAMES.RESIDENTIAL_ADDRESS
    ]).isRequired
  };

  inferAddressType(countryName, stateCode) {
    let addressType = 'DOMESTIC';
    if (countryName !== 'United States') {
      addressType = 'INTERNATIONAL';
    } else if (MILITARY_STATES.has(stateCode)) {
      addressType = 'OVERSEAS MILITARY';
    }

    return addressType;
  }

  convertNextValueToCleanData(value) {
    const {
      id,
      addressLine1,
      addressLine2,
      addressLine3,
      addressPou,
      city,
      countryName,
      stateCode,
      zipCode,
      internationalPostalCode,
      province,
    } = value;

    const addressType = this.inferAddressType(countryName, stateCode);

    return {
      id,
      addressLine1,
      addressLine2,
      addressLine3,
      addressPou,
      addressType,
      city,
      countryName,
      province: addressType === 'INTERNATIONAL' ? province : null,
      stateCode: addressType === 'INTERNATIONAL' ? null : stateCode,
      zipCode: addressType !== 'INTERNATIONAL' ? zipCode : null,
      internationalPostalCode: addressType === 'INTERNATIONAL' ? internationalPostalCode : null,
    };
  }

  validateCleanData({ addressLine1, city, stateCode,  internationalPostalCode, zipCode, countryName }, property) {
    const isInternational = this.inferAddressType(countryName, stateCode) === 'INTERNATIONAL';
    const validateAll = !property;

    return {
      addressLine1: (property === 'addressLine1' || validateAll) && !addressLine1 ? 'Street address is required' : '',
      city: (property === 'city' || validateAll) && !city ? 'City is required' : '',
      stateCode: (property === 'stateCode' || validateAll) && !isInternational && !stateCode ? 'State is required' : '',
      zipCode: (property === 'zipCode' || validateAll) && !isInternational && !zipCode ? 'Zip code is required' : '',
      internationalPostalCode: (property === 'internationalPostalCode' || validateAll) && isInternational && !internationalPostalCode ? 'Postal code is required' : '',
    };
  }

  convertCleanDataToPayload(cleanData, fieldName) {
    return pickBy({
      id: cleanData.id,
      addressLine1: cleanData.addressLine1,
      addressLine2: cleanData.addressLine2,
      addressLine3: cleanData.addressLine3,
      addressType: cleanData.addressType,
      city: cleanData.city,
      countryName: cleanData.countryName,
      stateCode: cleanData.stateCode,
      internationalPostalCode: cleanData.internationalPostalCode,
      zipCode: cleanData.zipCode,
      province: cleanData.province,
      addressPou: fieldName === FIELD_NAMES.MAILING_ADDRESS ? 'CORRESPONDENCE' : 'RESIDENCE/CHOICE',
    }, e => !!e);
  }

  render() {
    return (
      <Vet360ProfileField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.ADDRESSES}
        convertNextValueToCleanData={this.convertNextValueToCleanData}
        validateCleanData={this.validateCleanData}
        convertCleanDataToPayload={this.convertCleanDataToPayload}
        deleteDisabled={this.props.deleteDisabled}
        Content={AddressView}
        EditModal={AddressEditModal}/>
    );
  }
}
