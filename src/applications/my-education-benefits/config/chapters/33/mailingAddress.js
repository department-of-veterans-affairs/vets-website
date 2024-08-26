import React from 'react';
import * as address from 'platform/forms-system/src/js/definitions/address';
import get from 'platform/utilities/data/get';
import constants from 'vets-json-schema/dist/constants.json';

import fullSchema from '../../../22-1990-schema.json';

import LearnMoreAboutMilitaryBaseTooltip from '../../../components/LearnMoreAboutMilitaryBaseTooltip';
import MailingAddressViewField from '../../../components/MailingAddressViewField';
import YesNoReviewField from '../../../components/YesNoReviewField';

// import commonDefinitions from 'vets-json-schema/dist/definitions.json';
// const {
//   usaPhone,
//   email,
// } = commonDefinitions;

import { formFields } from '../../../constants';

function isOnlyWhitespace(str) {
  return str && !str.trim().length;
}

const mailingAddress33 = {
  uiSchema: {
    'view:subHeadings': {
      'ui:description': (
        <>
          <h3>Review your mailing address</h3>
          <p>
            We’ll send any important information about your application to this
            address.
          </p>
          <p>
            This is the mailing address we have on file for you. If you notice
            any errors, please correct them now. Any updates you make will
            change the information for your education benefits only.
          </p>
          <p>
            <strong>Note:</strong> If you want to update your personal
            information for other VA benefits, you can do that from your
            profile.
          </p>
          <p>
            <a href="/profile/personal-information">Go to your profile</a>
          </p>
        </>
      ),
    },
    [formFields.viewMailingAddress]: {
      'ui:description': (
        <>
          <h4 className="form-review-panel-page-header vads-u-font-size--h5 meb-review-page-only">
            Mailing address
          </h4>
          <p className="meb-review-page-only">
            If you’d like to update your mailing address, please edit the form
            fields below.
          </p>
        </>
      ),
      [formFields.livesOnMilitaryBase]: {
        'ui:title': (
          <span id="LiveOnMilitaryBaseTooltip">
            I live on a United States military base outside of the country
          </span>
        ),
        'ui:reviewField': YesNoReviewField,
      },
      livesOnMilitaryBaseInfo: {
        'ui:description': LearnMoreAboutMilitaryBaseTooltip(),
      },
      [formFields.address]: {
        ...address.uiSchema('', false, null, true),
        country: {
          'ui:title': 'Country',
          'ui:required': formData =>
            !formData.showMebDgi40Features ||
            (formData.showMebDgi40Features &&
              !formData['view:mailingAddress'].livesOnMilitaryBase),
          'ui:disabled': formData =>
            formData.showMebDgi40Features &&
            formData['view:mailingAddress'].livesOnMilitaryBase,
          'ui:options': {
            updateSchema: (formData, schema, uiSchema) => {
              const countryUI = uiSchema;
              const addressFormData = get(
                ['view:mailingAddress', 'address'],
                formData,
              );
              const livesOnMilitaryBase = get(
                ['view:mailingAddress', 'livesOnMilitaryBase'],
                formData,
              );
              if (formData.showMebDgi40Features && livesOnMilitaryBase) {
                countryUI['ui:disabled'] = true;
                const USA = {
                  value: 'USA',
                  label: 'United States',
                };
                addressFormData.country = USA.value;
                return {
                  enum: [USA.value],
                  enumNames: [USA.label],
                  default: USA.value,
                };
              }

              countryUI['ui:disabled'] = false;

              return {
                type: 'string',
                enum: constants.countries.map(country => country.value),
                enumNames: constants.countries.map(country => country.label),
              };
            },
          },
        },
        street: {
          'ui:title': 'Street address',
          'ui:errorMessages': {
            required: 'Please enter your full street address',
          },
          'ui:validations': [
            (errors, field) => {
              if (isOnlyWhitespace(field)) {
                errors.addError('Please enter your full street address');
              }
            },
          ],
        },
        city: {
          'ui:errorMessages': {
            required: 'Please enter a valid city',
          },
          'ui:validations': [
            (errors, field) => {
              if (isOnlyWhitespace(field)) {
                errors.addError('Please enter a valid city');
              }
            },
          ],
          'ui:options': {
            replaceSchema: formData => {
              if (
                formData.showMebDgi40Features &&
                formData['view:mailingAddress']?.livesOnMilitaryBase
              ) {
                return {
                  type: 'string',
                  title: 'APO/FPO',
                  enum: ['APO', 'FPO'],
                };
              }

              return {
                type: 'string',
                title: 'City',
              };
            },
          },
        },
        state: {
          'ui:required': formData =>
            !formData.showMebDgi40Features ||
            (formData.showMebDgi40Features &&
              (formData['view:mailingAddress']?.livesOnMilitaryBase ||
                formData['view:mailingAddress']?.address?.country === 'USA')),
        },
        postalCode: {
          'ui:errorMessages': {
            required: 'Zip code must be 5 digits',
          },
          'ui:options': {
            replaceSchema: formData => {
              if (formData['view:mailingAddress']?.address?.country !== 'USA') {
                return {
                  title: 'Postal Code',
                  type: 'string',
                };
              }

              return {
                title: 'Zip code',
                type: 'string',
              };
            },
          },
        },
      },
      'ui:options': {
        hideLabelText: true,
        showFieldLabel: false,
        viewComponent: MailingAddressViewField,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:subHeadings': {
        type: 'object',
        properties: {},
      },
      [formFields.viewMailingAddress]: {
        type: 'object',
        properties: {
          [formFields.livesOnMilitaryBase]: {
            type: 'boolean',
          },
          livesOnMilitaryBaseInfo: {
            type: 'object',
            properties: {},
          },
          [formFields.address]: {
            ...address.schema(fullSchema, true),
          },
        },
      },
    },
  },
};

export default mailingAddress33;
