import React from 'react';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

import { API_ROUTES, FIELD_NAMES, PHONE_TYPE, USA } from '@@vap-svc/constants';

import PhoneNumberWidget from 'platform/forms-system/src/js/widgets/PhoneNumberWidget';

import VAPProfileField from '../VAPProfileField';
import ReceiveTextMessages from '@@vap-svc/containers/ReceiveTextMessages';

import PhoneEditView from './PhoneEditView';

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
    isTextPermitted: {
      type: 'boolean',
    },
  },
  required: ['inputPhoneNumber'],
};

const uiSchema = {
  'view:noInternationalNumbers': {
    'ui:description': () => (
      <AlertBox
        isVisible
        status="info"
        className="vads-u-margin-bottom--3 vads-u-margin-top--1 medium-screen:vads-u-margin-top--0"
      >
        <p>
          We can only support U.S. phone numbers right now. If you have an
          international number, please check back later.
        </p>
      </AlertBox>
    ),
  },
  inputPhoneNumber: {
    'ui:widget': PhoneNumberWidget,
    'ui:title': 'Number',
    'ui:errorMessages': {
      pattern: 'Please enter a valid phone number.',
    },
  },
  extension: {
    'ui:title': 'Extension',
    'ui:errorMessages': {
      pattern: 'Please enter a valid extension.',
    },
  },
  isTextPermitted: {
    'ui:title':
      'Send me text message (SMS) reminders for my VA health care appointments',
    'ui:options': {
      hideIf: formData => !formData['view:showSMSCheckbox'],
    },
  },
};

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
    const {
      id,
      countryCode,
      extension,
      phoneType,
      inputPhoneNumber,
      isTextable,
      isTextPermitted,
    } = value;

    const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
    const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

    return {
      id,
      areaCode: strippedPhone.substring(0, 3),
      countryCode,
      extension: strippedExtension,
      inputPhoneNumber,
      isInternational: countryCode !== USA.COUNTRY_CODE,
      isTextable,
      isTextPermitted,
      phoneNumber: strippedPhone.substring(3),
      phoneType,
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
        isInternational: false, // currently no international phone number support
        isTextable: cleanData.isTextable,
        isTextPermitted: cleanData.isTextPermitted,
        phoneNumber: cleanData.phoneNumber,
        phoneType: PHONE_TYPE[fieldName],
      },
      e => !!e,
    );
  };

  render() {
    const ContentView = ({ data }) => {
      const { areaCode, phoneNumber, extension } = data;

      return (
        <div>
          <Telephone
            contact={`${areaCode}${phoneNumber}`}
            extension={extension}
            notClickable
          />

          {this.props.fieldName === FIELD_NAMES.MOBILE_PHONE && (
            <ReceiveTextMessages fieldName={FIELD_NAMES.MOBILE_PHONE} />
          )}
        </div>
      );
    };

    return (
      <VAPProfileField
        apiRoute={API_ROUTES.TELEPHONES}
        ContentView={ContentView}
        convertCleanDataToPayload={this.convertCleanDataToPayload}
        EditView={PhoneEditView}
        fieldName={this.props.fieldName}
        formSchema={formSchema}
        title={this.props.title}
        uiSchema={uiSchema}
      />
    );
  }
}
