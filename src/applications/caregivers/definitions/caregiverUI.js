import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import email from 'platform/forms-system/src/js/definitions/email';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  FacilityInfo,
  PleaseSelectVAFacility,
} from 'applications/caregivers/components/AdditionalInfo';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import get from 'platform/utilities/data/get';
import { primaryCaregiverFields, vetFields } from './constants';
import {
  medicalCenterLabels,
  medicalCentersByState,
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
        'ui:title': `${label}'s first name`,
        'ui:errorMessages': {
          required: `Please enter ${label}'s first name`,
        },
      },
      last: {
        'ui:title': `${label}'s last name`,
        'ui:errorMessages': {
          required: `Please enter ${label}'s last name`,
        },
      },
      middle: {
        'ui:title': `${label}'s middle name`,
      },
    }),
    dateOfBirthUI: label => currentOrPastDateUI(`${label}'s date of birth`),
    addressUI: address.uiSchema(' ', false),
    primaryPhoneNumberUI: label =>
      phoneUI(`${label}'s primary telephone number (including area code)`),
    alternativePhoneNumberUI: label =>
      phoneUI(`${label}'s alternate telephone number (Including Area Code)`),
    ssnUI: label => ({
      ...ssnUI,
      'ui:title': `${label}'s Social Security Number/Tax Identification Number`,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    }),
    emailUI: label => email(`${label}'s email address`),
    confirmationEmailUI: label => ({
      'ui:title': `${label}'s re-enter email address`,
      'ui:widget': 'email',
      'ui:errorMessages': {
        pattern: 'Please enter an email address using this format: X@X.com',
        required: 'Please enter an email address',
      },
      'ui:options': {
        widgetClassNames: 'va-input-large',
        inputType: 'email',
      },
      'ui:validations': [
        {
          validator: (errors, fieldData, formData, dataConstant) => {
            const emailMatcher = () => formData[dataConstant] === fieldData;
            const doesEmailMatch = emailMatcher();
            if (!doesEmailMatch) {
              errors.addError(
                'This email does not match your previously entered email',
              );
            }
          },
        },
      ],
    }),
    genderUI: label => ({
      'ui:title': `${label}'s Sex`,
      'ui:widget': 'radio',
      'ui:options': { labels: { F: 'Female', M: 'Male', U: 'Unknown' } },
    }),
    vetRelationshipUI: label => ({
      'ui:title': `${label}'s relationship to Veteran (e.g., Spouse, Parent, Child, Other):`,
    }),
    hasSecondaryCaregiverOneUI: {
      'ui:title': 'Would you like to add a Secondary Caregiver?',
      'ui:widget': 'yesNo',
      'ui:options': {
        hideOnReview: true,
      },
    },
    hasSecondaryCaregiverTwoUI: {
      'ui:title': 'Add another secondary caregiver',
      'ui:label': 'Add another secondary caregiver',
      'ui:widget': 'yesNo',
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  vetUI: {
    vetInputLabel: 'Veteran',
    previousTreatmentFacilityUI: {
      'ui:title':
        'Please enter the name of the medical facility where the Veteran last received medical treatment.',

      'ui:order': ['name', 'type'],
      name: {
        'ui:title': 'Facility Name',
      },
      type: {
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
        'ui:title': 'Facility State',

        'ui:options': {
          labels: stateLabels,
        },
      },
      [vetFields.plannedClinic]: {
        'ui:title':
          'VA medical center where the Veteran receives or plans to receive care',
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
    primaryInputLabel: 'Primary Family Caregiver',
    medicaidEnrolledUI: {
      'ui:title': 'Is the Primary Family Caregiver enrolled in Medicaid',
      'ui:widget': 'yesNo',
    },
    medicareEnrolledUI: {
      'ui:title': 'Is the Primary Family Caregiver enrolled in Medicare?',
      'ui:widget': 'yesNo',
    },
    tricareEnrolledUI: {
      'ui:title': 'Is the Primary Family Caregiver enrolled in Tricare?',
      'ui:widget': 'yesNo',
    },
    champvaEnrolledUI: {
      'ui:title': 'Is the Primary Family Caregiver enrolled in CHAMPVA?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently enrolled in other health care insurance?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceNameUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently enrolled in other health care insurance?',
      'ui:options': {
        expandUnder: primaryCaregiverFields.otherHealthInsurance,
      },
    },
  },
  secondaryCaregiversUI: {
    secondaryOneInputLabel: 'Secondary Family Caregiver',
    secondaryOneChapterTitle: 'Secondary Family Caregiver information',
    secondaryTwoInputLabel: 'Secondary Family Caregiver',
    secondaryTwoChapterTitle: 'Secondary Family Caregiver (2) information',
  },
};

export const confirmationEmailUI = (label, dataConstant) => ({
  'ui:title': `Re-enter ${label}'s email address`,
  'ui:widget': 'email',
  'ui:errorMessages': {
    pattern: 'Please enter an email address using this format: X@X.com',
    required: 'Please enter an email address',
  },
  'ui:options': {
    widgetClassNames: 'va-input-large',
    inputType: 'email',
  },
  'ui:validations': [
    {
      validator: (errors, fieldData, formData) => {
        const emailMatcher = () =>
          formData[dataConstant] === formData[`view:${dataConstant}`];
        const doesEmailMatch = emailMatcher();
        if (!doesEmailMatch) {
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
    'ui:title': `${label}'s street`,
    'ui:errorMessages': { required: 'Please enter a street address' },
  },
  street2: { 'ui:title': `${label}'s line 2` },
  city: {
    'ui:title': `${label}'s city`,
    'ui:errorMessages': { required: 'Please enter a city' },
  },
  state: {
    'ui:title': `${label}'s state`,
    'ui:options': {
      labels: stateLabels,
    },
    'ui:errorMessages': { required: 'Please enter a state' },
  },
  postalCode: {
    'ui:title': `${label}'s postal code`,
    'ui:options': { widgetClassNames: 'usa-input-medium' },
    'ui:errorMessages': {
      required: 'Please enter a postal code',
      pattern:
        'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    },
  },
});
