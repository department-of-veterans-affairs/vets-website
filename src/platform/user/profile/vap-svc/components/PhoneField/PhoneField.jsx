import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';

import {
  API_ROUTES,
  FIELD_NAMES,
  FIELD_TITLES,
  PHONE_TYPE,
  USA,
} from 'platform/user/profile/vap-svc/constants';

import VAPServiceProfileField from 'platform/user/profile/vap-svc/containers/VAPServiceProfileField';
import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import PhoneEditModal from './PhoneEditModal';
import PhoneView from './PhoneView';

const formSchema = {
  type: 'object',
  properties: {
    'view:noInternationalNumbers': {
      type: 'object',
      properties: {},
    },
    inputPhoneNumber: {
      type: 'string',
      pattern: '^\\d{10}$',
    },
    extension: {
      type: 'string',
      pattern: '^\\s*[a-zA-Z0-9]{0,10}\\s*$',
    },
  },
  required: ['inputPhoneNumber'],
};

const uiSchema = fieldName => {
  const title = FIELD_TITLES[fieldName].replace('number', '');
  return {
    inputPhoneNumber: {
      'ui:widget': PhoneNumberWidget,
      'ui:title': `${title} (U.S. numbers only)`,
      'ui:errorMessages': {
        pattern: 'Please enter a valid 10-digit U.S. phone number.',
      },
    },
    extension: {
      'ui:title': 'Extension',
      'ui:errorMessages': {
        pattern: 'Please enter a valid extension.',
      },
    },
  };
};

export default class PhoneField extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    fieldName: PropTypes.oneOf([
      FIELD_NAMES.HOME_PHONE,
      FIELD_NAMES.MOBILE_PHONE,
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

  convertCleanDataToPayload = (data, fieldName) => {
    let cleanData = data;
    if (data.inputPhoneNumber) {
      cleanData = this.convertNextValueToCleanData(data);
    }
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
  };

  render() {
    return (
      <VAPServiceProfileField
        title={this.props.title}
        fieldName={this.props.fieldName}
        apiRoute={API_ROUTES.TELEPHONES}
        convertCleanDataToPayload={this.convertCleanDataToPayload}
        Content={PhoneView}
        EditModal={PhoneEditModal}
        formSchema={formSchema}
        uiSchema={uiSchema(this.props.fieldName)}
        deleteDisabled={this.props.deleteDisabled}
        alertClosingDisabled={this.props.alertClosingDisabled}
      />
    );
  }
}
