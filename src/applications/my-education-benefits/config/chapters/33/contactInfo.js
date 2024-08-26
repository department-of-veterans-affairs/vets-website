import React from 'react';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

import { formFields } from '../../../constants';

import CustomEmailField from '../../../components/CustomEmailField';
import CustomPhoneNumberField from '../../../components/CustomPhoneNumberField';
import EmailViewField from '../../../components/EmailViewField';
import PhoneReviewField from '../../../components/PhoneReviewField';
import PhoneViewField from '../../../components/PhoneViewField';
import DuplicateContactInfoModal from '../../../components/DuplicateContactInfoModal';
import YesNoReviewField from '../../../components/YesNoReviewField';

import {
  validateEmail,
  validateMobilePhone,
  validateHomePhone,
} from '../../../utils/validation';

const { usaPhone, email } = commonDefinitions;

function titleCase(str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function phoneUISchema(category) {
  const schema = {
    'ui:options': {
      hideLabelText: true,
      showFieldLabel: false,
      viewComponent: PhoneViewField,
    },
    'ui:objectViewField': PhoneReviewField,
    phone: {
      ...phoneUI(`${titleCase(category)} phone number`),
      'ui:validations': [
        category === 'mobile' ? validateMobilePhone : validateHomePhone,
      ],
    },
    isInternational: {
      'ui:title': `This ${category} phone number is international`,
      'ui:reviewField': YesNoReviewField,
      'ui:options': {
        hideIf: formData => {
          if (category === 'mobile') {
            if (
              !formData[(formFields?.viewPhoneNumbers)]?.mobilePhoneNumber
                ?.phone
            ) {
              return true;
            }
          } else if (
            !formData[(formFields?.viewPhoneNumbers)]?.phoneNumber?.phone
          ) {
            return true;
          }
          return false;
        },
      },
    },
  };

  // use custom component if mobile phone
  if (category === 'mobile') {
    schema.phone['ui:widget'] = CustomPhoneNumberField;
  }

  return schema;
}

function phoneSchema() {
  return {
    type: 'object',
    properties: {
      phone: {
        ...usaPhone,
        pattern: '^\\d[-]?\\d(?:[0-9-]*\\d)?$',
      },
      isInternational: {
        type: 'boolean',
      },
    },
  };
}

const contactInfo33 = {
  uiSchema: {
    'view:subHeadings': {
      'ui:description': (
        <>
          <h3>Review your phone numbers and email address</h3>
          <div className="meb-list-label">
            <strong>We’ll use this information to:</strong>
          </div>
          <ul>
            <li>Contact you if we have questions about your application</li>
            <li>Tell you important information about your benefits</li>
          </ul>
          <p>
            This is the contact information we have on file for you. If you
            notice any errors, please correct them now. Any updates you make
            will change the information for your education benefits only.
          </p>
          <p>
            <strong>Note:</strong> If you want to update your contact
            information for other VA benefits, you can do that from your
            profile.
          </p>
          <p>
            <a href="/profile/personal-information">Go to your profile</a>
          </p>
        </>
      ),
    },
    [formFields.viewPhoneNumbers]: {
      'ui:description': (
        <>
          <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
            Phone numbers and email addresses
          </h4>
          <p className="meb-review-page-only">
            If you’d like to update your phone numbers and email address, please
            edit the form fields below.
          </p>
        </>
      ),
      [formFields?.mobilePhoneNumber]: phoneUISchema('mobile'),
      [formFields?.phoneNumber]: phoneUISchema('home'),
    },
    [formFields.email]: {
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
        viewComponent: EmailViewField,
      },
      email: {
        ...emailUI('Email address'),
        'ui:validations': [validateEmail],
        'ui:widget': CustomEmailField,
      },
      confirmEmail: {
        ...emailUI('Confirm email address'),
        'ui:options': {
          ...emailUI()['ui:options'],
          hideOnReview: true,
        },
      },
      'ui:validations': [
        (errors, field) => {
          if (
            field?.email?.toLowerCase() !== field?.confirmEmail?.toLowerCase()
          ) {
            errors.confirmEmail?.addError('Sorry, your emails must match');
          }
        },
      ],
    },
    'view:confirmDuplicateData': {
      'ui:description': DuplicateContactInfoModal,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:subHeadings': {
        type: 'object',
        properties: {},
      },
      [formFields.viewPhoneNumbers]: {
        type: 'object',
        properties: {
          [formFields?.mobilePhoneNumber]: phoneSchema(),
          [formFields?.phoneNumber]: phoneSchema(),
        },
      },
      [formFields.email]: {
        type: 'object',
        required: [formFields.email, 'confirmEmail'],
        properties: {
          email,
          confirmEmail: email,
        },
      },
      'view:confirmDuplicateData': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contactInfo33;
