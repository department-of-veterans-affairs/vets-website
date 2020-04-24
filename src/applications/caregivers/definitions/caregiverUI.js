import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { FacilityInfo } from 'applications/caregivers/components/AdditionalInfo';

import { primaryCaregiverFields, vetFields } from './constants';
import {
  medicalCenterLabels,
  medicalCentersByState,
} from 'applications/caregivers/helpers';
import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';
import get from 'platform/utilities/data/get';

const emptyFacilityList = [];
const stateLabels = createUSAStateLabels(states);

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedItems: {
    fullNameUI,
    dateOfBirthUI: currentOrPastDateUI('Date of Birth'),
    addressUI: address.uiSchema(' ', false),
    primaryPhoneNumberUI: phoneUI(
      'Primary Telephone Number (Including Area Code)',
    ),
    alternativePhoneNumberUI: phoneUI(
      'Alternate Telephone Number (Including Area Code)',
    ),
    emailUI: {
      'ui:title': 'Email Address',
      'ui:widget': 'email',
    },
    confirmationEmailUI: {
      'ui:title': 'Re-enter email address',
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
          validator: (errors, fieldData, formData, label) => {
            const emailMatcher = () => formData[label] === fieldData;
            const doesEmailMatch = emailMatcher();
            if (!doesEmailMatch) {
              errors.addError(
                'This email does not match your previously entered email',
              );
            }
          },
        },
      ],
    },
    genderUI: {
      'ui:title': 'Sex',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          F: 'Female',
          M: 'Male',
          U: 'Unknown',
        },
      },
    },
    vetRelationshipUI: {
      'ui:title':
        'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
    },
    hassecondaryCaregiverOneUI: {
      'ui:title': 'Would you like to add a Secondary Caregiver?',
      'ui:widget': 'yesNo',
    },
    hassecondaryCaregiverTwoUI: {
      'ui:title': 'Add another secondary caregiver',
      'ui:label': 'Add another secondary caregiver',
      'ui:widget': 'yesNo',
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  vetUI: {
    ssnUI: {
      ...ssnUI,
      'ui:title': `Veteran's Social Security Number/Tax Identification Number`,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
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
      'ui:description':
        'Please select the VA medical center or clinic where the Veteran receives or plans to receive health care services.\n' +
        'A member of the Caregiver Support Program team at the VA medical center where the Veteran receives or plans to receive care will review your application.',
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
    ssnUI: {
      ...ssnUI,
      'ui:title': 'Social Security number or Tax Identification number',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    medicaidEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in Medicaid?',
      'ui:widget': 'yesNo',
    },
    medicareEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in Medicare?',
      'ui:widget': 'yesNo',
    },
    tricareEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in Tricare?',
      'ui:widget': 'yesNo',
    },
    champvaEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in CHAMPVA?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently enrolled in other health care insurance?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceNameUI: {
      'ui:title': 'Other Health Insurance Name?',
      'ui:options': {
        expandUnder: primaryCaregiverFields.otherHealthInsurance,
      },
    },
  },
  secondaryCaregiverUI: {
    secondaryOne: {
      ssnUI: {
        ...ssnUI,
        'ui:title': 'Social Security number or Tax Identification number',

        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },
      fullNameUI: {
        ...fullNameUI,
      },
    },
    secondaryTwo: {
      ssnUI: {
        ...ssnUI,
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },

      // had to duplicate code to add expandUnder option - refactor later
      fullNameUI: {
        ...fullNameUI,
      },
      genderUI: {
        'ui:title': 'Sex',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            F: 'Female',
            M: 'Male',
            U: 'Unknown',
          },
        },
      },
      dateOfBirthUI: {
        ...currentOrPastDateUI('Date of Birth'),
      },
      primaryPhoneNumberUI: {
        ...phoneUI('Primary Telephone Number (Including Area Code)'),
      },
      alternativePhoneNumberUI: {
        ...phoneUI('Alternate Telephone Number (Including Area Code)'),
      },
      emailUI: {
        'ui:title': 'Email Address',
        'ui:widget': 'email',
      },
      vetRelationshipUI: {
        'ui:title':
          'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
      },
    },
  },
};

export const confirmationEmail = label => ({
  'ui:title': 'Re-enter email address',
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
          formData[label] === formData[`view:${label}`];
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

export const addressWithoutCountry = {
  'ui:title': ' ',
  'ui:order': ['street', 'street2', 'city', 'state', 'postalCode'],
  street: {
    'ui:title': 'Street',
    'ui:errorMessages': { required: 'Please enter a street address' },
  },
  street2: { 'ui:title': 'Line 2' },
  city: {
    'ui:title': 'City',
    'ui:errorMessages': { required: 'Please enter a city' },
  },
  state: {
    'ui:title': 'State',
    'ui:options': {
      labels: stateLabels,
    },
    'ui:errorMessages': { required: 'Please enter a state' },
  },
  postalCode: {
    'ui:title': 'Postal code',
    'ui:options': { widgetClassNames: 'usa-input-medium' },
    'ui:errorMessages': {
      required: 'Please enter a postal code',
      pattern:
        'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    },
  },
};
