import React from 'react';
import * as address from 'platform/forms-system/src/js/definitions/address';
import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import email from 'platform/forms-system/src/js/definitions/email';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import {
  FacilityInfo,
  PleaseSelectVAFacility,
  AdditionalCaregiverInfo,
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
      'ui:title': `${label}  Social Security Number/Tax Identification Number`,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    }),
    emailUI: label => email(`${label}  email address`),
    confirmationEmailUI: label => ({
      'ui:title': `${label}  re-enter email address`,
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
      'ui:title': `${label}  sex`,
      'ui:widget': 'radio',
      'ui:options': { labels: { F: 'Female', M: 'Male', U: 'Unknown' } },
    }),
    vetRelationshipUI: label => ({
      'ui:title': `What is the ${label}  relationship to the Veteran?`,
    }),
    hasSecondaryCaregiverOneUI: {
      'ui:title': 'Would you like to add a Secondary Family Caregiver?',
      'ui:widget': 'yesNo',
      'ui:options': {
        hideOnReview: true,
      },
    },
    hasSecondaryCaregiverTwoUI: {
      'ui:title': ' ',
      'ui:description': AdditionalCaregiverInfo(),
      'ui:widget': 'yesNo',
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  vetUI: {
    vetInputLabel: "Veteran's",
    previousTreatmentFacilityUI: {
      'ui:title': ' ',
      'ui:order': ['name', 'type'],
      name: {
        'ui:title':
          'Please enter the name of the medical facility where the Veteran last received medical treatment.',
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
    primaryInputLabel: "Primary Family Caregiver's",
    medicaidEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in Medicaid?',
      'ui:description': (
        <div className="vads-u-margin-y--1p5 vads-u-margin-bottom--2p5">
          <AdditionalInfo triggerText="Learn more about Medicaid">
            Medicaid is a government health program for eligible low-income
            individuals and families and people with disabilities.
          </AdditionalInfo>
        </div>
      ),
      'ui:widget': 'yesNo',
    },
    medicareEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in Medicare?',
      'ui:description': (
        <div className="vads-u-margin-y--1p5 vads-u-margin-bottom--2p5">
          <AdditionalInfo triggerText="Learn more about Medicare">
            Medicare is a federal health insurance program providing coverage
            for people who are 65 years or older or who meet who meet special
            criteria. Part A insurance covers hospital care, skilled nursing and
            nursing home care, hospice, and home health services.
          </AdditionalInfo>
        </div>
      ),
      'ui:widget': 'yesNo',
    },
    tricareEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in Tricare?',
      'ui:description': (
        <div className="vads-u-margin-y--1p5 vads-u-margin-bottom--2p5">
          <AdditionalInfo triggerText="Learn more about Tricare">
            Tricare is a government health care program for service members,
            veterans, and their families.
          </AdditionalInfo>
        </div>
      ),
      'ui:widget': 'yesNo',
    },
    champvaEnrolledUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently in enrolled in CHAMPVA?',
      'ui:description': (
        <div className="vads-u-margin-y--1p5 vads-u-margin-bottom--2p5">
          <AdditionalInfo triggerText="Learn more about CHAMPVA">
            Civilian Health and Medical Program of the Department of Veterans
            Affairs
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="vads-u-margin-x--0p5"
              href="https://www.va.gov/COMMUNITYCARE/programs/caregiver/index.asp"
            >
              (CHAMPVA)
            </a>
            is a cost-sharing program that covers the price of some health care
            services and supplies.
          </AdditionalInfo>
        </div>
      ),
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceUI: {
      'ui:title':
        'Is the Primary Family Caregiver currently enrolled in other health care insurance?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceNameUI: {
      'ui:title':
        'Name of health insurance? (if there are multiple policies, please separate them with commas)',
      'ui:options': {
        expandUnder: primaryCaregiverFields.otherHealthInsurance,
      },
    },
  },
  secondaryCaregiversUI: {
    secondaryOneInputLabel: "Secondary Family Caregiver's",
    secondaryOneChapterTitle: 'Secondary Family Caregiver information',
    secondaryTwoInputLabel: "Secondary Family Caregiver's (2)",
    secondaryTwoChapterTitle: "Secondary Family Caregiver's (2) information",
  },
};

export const confirmationEmailUI = (label, dataConstant) => ({
  'ui:title': `Re-enter ${label}  email address`,
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
