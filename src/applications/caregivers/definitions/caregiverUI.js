import React from 'react';
import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import email from 'platform/forms-system/src/js/definitions/email';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  FacilityInfo,
  PleaseSelectVAFacility,
  AdditionalCaregiverInfo,
  VeteranSSNInfo,
  SecondaryRequiredAlert,
} from 'applications/caregivers/components/AdditionalInfo';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import get from 'platform/utilities/data/get';
import { vetFields } from './constants';
import {
  medicalCenterLabels,
  medicalCentersByState,
  validateSSNIsUnique,
  facilityNameMaxLength,
  shouldHideAlert,
} from 'applications/caregivers/helpers';

const emptyFacilityList = [];
const stateLabels = createUSAStateLabels(states);

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedItems: {
    contactInfoTitle: 'Contact information',
    fullNameUI: label => ({
      first: {
        'ui:title': `${label}  first name`,
        'ui:errorMessages': {
          required: `Please enter ${label}  first name`,
        },
      },
      last: {
        'ui:title': `${label}  last name`,
        'ui:errorMessages': {
          required: `Please enter ${label}  last name`,
        },
      },
      middle: {
        'ui:title': `${label}  middle name`,
      },
    }),
    dateOfBirthUI: label => currentOrPastDateUI(`${label}  date of birth`),
    addressUI: address.uiSchema(' ', false),
    primaryPhoneNumberUI: label =>
      phoneUI(`${label}  primary telephone number (including area code)`),
    alternativePhoneNumberUI: label =>
      phoneUI(`${label}  alternate telephone number (including area code)`),
    ssnUI: label => ({
      ...ssnUI,
      'ui:title': `${label}  Social Security number or tax identification number`,
      'ui:description': label === 'Veteran\u2019s' && VeteranSSNInfo(),
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
      'ui:errorMessages': {
        pattern:
          'Please enter a valid Social Security or tax identification number',
        required: 'Please enter a Social Security or tax identification number',
      },
      'ui:validations': [
        ...ssnUI['ui:validations'],
        {
          validator: (errors, fieldData, formData) => {
            validateSSNIsUnique(errors, formData);
          },
        },
      ],
    }),
    emailUI: label => email(`${label}  email address`),
    genderUI: label => ({
      'ui:title': `${label}  sex`,
      'ui:widget': 'radio',
      'ui:options': { labels: { F: 'Female', M: 'Male' } },
    }),
    vetRelationshipUI: label => ({
      'ui:title': `What is the ${label}  relationship to the Veteran?`,
    }),
    secondaryRequiredAlert: {
      'ui:title': ' ',
      'ui:widget': SecondaryRequiredAlert,
      'ui:options': {
        hideIf: formData => shouldHideAlert(formData),
      },
    },
    hasSecondaryCaregiverTwoUI: {
      'ui:title': ' ',
      'ui:description': AdditionalCaregiverInfo,
      'ui:widget': 'yesNo',
    },
  },
  vetUI: {
    vetInputLabel: 'Veteran\u2019s',
    previousTreatmentFacilityUI: {
      'ui:title': ' ',
      'ui:order': ['name', 'type'],
      'ui:description': (
        <div>
          <h3 className="vads-u-font-size--h4">Recent medical care</h3>
          <p>
            Please enter the name of the medical facility where the Veteran
            <strong className="vads-u-margin-left--0p5">
              last received medical treatment.
            </strong>
          </p>
        </div>
      ),
      name: {
        'ui:required': formData => !!formData.veteranLastTreatmentFacility.type,
        'ui:validations': [
          {
            validator: (errors, fieldData, formData) => {
              facilityNameMaxLength(errors, formData);
            },
          },
        ],
        'ui:title': 'Name of medical facility',
      },
      type: {
        'ui:required': formData => !!formData.veteranLastTreatmentFacility.name,
        'ui:title': 'Was this a hospital or clinic?',
        'ui:options': {
          labels: {
            hospital: 'Hospital',
            clinic: 'Clinic',
          },
        },
      },
    },
    [vetFields.preferredFacilityView]: {
      'ui:description': PleaseSelectVAFacility(),
      [vetFields.preferredFacilityStateView]: {
        'ui:title': 'State',

        'ui:options': {
          labels: stateLabels,
        },
      },
      [vetFields.plannedClinic]: {
        'ui:title': 'VA medical center',
        'ui:options': {
          labels: medicalCenterLabels,
          updateSchema: form => {
            const state = get(
              `${[vetFields.preferredFacilityView]}.${[
                vetFields.preferredFacilityStateView,
              ]}`,
              form,
            );
            if (state) {
              return {
                enum: medicalCentersByState[state] || emptyFacilityList,
              };
            }

            return {
              enum: emptyFacilityList,
            };
          },
        },
      },
    },
    preferredFacilityInfo: {
      'ui:title': ' ',
      'ui:widget': FacilityInfo,
    },
  },
  primaryCaregiverUI: {
    primaryInputLabel: 'Primary Family Caregiver\u2019s',
    hasHealthInsurance: {
      'ui:title':
        'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
      'ui:widget': 'yesNo',
    },
  },
  secondaryCaregiversUI: {
    secondaryOneInputLabel: 'Secondary Family Caregiver\u2019s',
    secondaryOneChapterTitle:
      'Secondary Family Caregiver applicant information',
    secondaryTwoInputLabel: 'Secondary Family Caregiver\u2019s (2)',
    secondaryTwoChapterTitle:
      'Secondary Family Caregiver\u2019s (2) applicant information',
  },
};

export const confirmationEmailUI = (label, dataConstant) => ({
  'ui:title': `Re-enter ${label}  email address`,
  'ui:widget': 'email',
  'ui:required': formData => !!formData[dataConstant],
  'ui:validations': [
    {
      validator: (errors, fieldData, formData) => {
        const doesEmailMatch = () =>
          formData[dataConstant] === formData[`view:${dataConstant}`];

        if (!doesEmailMatch()) {
          errors.addError(
            'This email does not match your previously entered email',
          );
        }
      },
    },
  ],
});

export const addressWithoutCountryUI = label => ({
  'ui:title': ' ',
  'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
  street: {
    'ui:title': `${label}  current street address`,
    'ui:errorMessages': { required: 'Please enter a street address' },
  },
  street2: { 'ui:title': `Line 2` },
  city: {
    'ui:title': `City`,
    'ui:errorMessages': { required: 'Please enter a city' },
  },
  state: {
    'ui:title': `State`,
    'ui:options': {
      labels: stateLabels,
    },
    'ui:errorMessages': { required: 'Please enter a state' },
  },
  postalCode: {
    'ui:title': `Postal code`,
    'ui:options': { widgetClassNames: 'usa-input-medium' },
    'ui:errorMessages': {
      required: 'Please enter a postal code',
      pattern:
        'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    },
  },
});
