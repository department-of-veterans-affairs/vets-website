import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';

import { API_ROUTES, FIELD_NAMES, PHONE_TYPE, USA } from '../../constants';

import { isValidPhone } from '../../../../../../platform/forms/validations';

import Vet360ProfileField from '../../containers/ProfileField';

import PhoneEditModal from './EditModal';
import PhoneView from './View';

export default class PhoneField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([
      FIELD_NAMES.HOME_PHONE,
      FIELD_NAMES.MOBILE_PHONE,
      FIELD_NAMES.TEMP_PHONE,
      FIELD_NAMES.WORK_PHONE,
      FIELD_NAMES.FAX_NUMBER,
    ]).isRequired,
  };

  convertNextValueToCleanData(value) {
    const { id, countryCode, extension, phoneType, inputPhoneNumber } = value;

    const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
    const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

    return {
      id,
      areaCode: strippedPhone.substring(0, 3),
      countryCode,
      extension: strippedExtension,
      phoneType,
      phoneNumber: strippedPhone.substring(3),
      isInternational: countryCode !== USA.COUNTRY_CODE,
      inputPhoneNumber,
    };
  }

  validateCleanData({ inputPhoneNumber }) {
    return {
      inputPhoneNumber:
        inputPhoneNumber && isValidPhone(inputPhoneNumber)
          ? ''
          : 'Please enter a valid phone.',
    };
  }

  convertCleanDataToPayload(cleanData, fieldName) {
    return pickBy(
      {
        id: cleanData.id,
        areaCode: cleanData.areaCode,
        countryCode: USA.COUNTRY_CODE, // currently no international phone number support
        extension: cleanData.extension,
        phoneNumber: cleanData.phoneNumber,
        isInternational: false, // currently no international phone number support
        phoneType: PHONE_TYPE[fieldName],
      },
      e => !!e,
    );
  }

  render() {
    return (
      <Vet360ProfileField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.TELEPHONES}
        convertNextValueToCleanData={this.convertNextValueToCleanData}
        validateCleanData={this.validateCleanData}
        convertCleanDataToPayload={this.convertCleanDataToPayload}
        Content={PhoneView}
        EditModal={PhoneEditModal}
      />
    );
  }
}
