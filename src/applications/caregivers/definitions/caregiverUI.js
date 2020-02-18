import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ssnUI from 'platform/forms-system/src/js/definitions/ssn';
import fullNameUI from 'platform/forms-system/src/js/definitions/fullName';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';

import { primaryCaregiverFields, vetFields } from './constants';

export default {
  'ui:title': fullSchema.title,
  'ui:options': {
    hideTitle: false,
  },
  sharedItems: {
    fullNameUI,
    dateOfBirthUI: currentOrPastDateUI('Date of Birth'),
    addressUI: address.uiSchema('Current Street Address', false),
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

    genderUI: {
      'ui:title': 'Gender',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          F: 'Female',
          M: 'Male',
        },
      },
    },
    previousTreatmentFacilityUI: {
      'ui:title': 'Name of facility where you last received medical treatment:',
      'ui:order': ['type', 'name'],
      name: {
        'ui:title': 'Facility Name',
      },
      type: {
        'ui:title': 'Facility Type',
        'ui:options': {
          labels: {
            hospital: 'Hospital',
            clinic: 'Clinic',
          },
        },
      },
    },
    facilityTypeUI: {
      'ui:title': 'Type of facility where you last received medical treatment:',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          hospital: 'Hospital',
          clinic: 'Clinic',
        },
      },
    },
    vetRelationshipUI: {
      'ui:title':
        'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
    },
    hasSecondaryOneCaregiverUI: {
      'ui:title': 'Would you like to add a Secondary Caregiver?',
      'ui:widget': 'yesNo',
    },
    hasSecondaryTwoCaregiverUI: {
      'ui:title': 'Add another secondary caregiver',
      'ui:label': 'Add another secondary caregiver',
      'ui:widget': 'yesNo',
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  vetUI: {
    vaEnrolledUI: {
      'ui:title': 'Enrolled in VA Health Care?',
      'ui:widget': 'yesNo',
    },
    plannedClinicUI: {
      'ui:title':
        'Name of VA medical center or clinic where you receive or plan to receive health care services:',
      'ui:options': {
        expandUnder: vetFields.vaEnrolled,
      },
    },
    ssnUI: {
      ...ssnUI,
      'ui:title': 'Social Security number or Tax Identification number',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
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
      'ui:title': 'Enrolled in Medicaid?',
    },
    medicareEnrolledUI: {
      'ui:title': 'Enrolled in Medicare?',
    },
    tricareEnrolledUI: {
      'ui:title': 'Enrolled in Tricare?',
    },
    champvaEnrolledUI: {
      'ui:title': 'Enrolled in CHAMPVA?',
    },
    otherHealthInsuranceUI: {
      'ui:title': 'Other Health Insurance?',
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
      addressUI: {
        ...address.uiSchema('Current Street Address', false),
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
        'ui:title': 'Gender',
        'ui:widget': 'radio',
        'ui:options': {
          labels: {
            F: 'Female',
            M: 'Male',
          },
        },
      },
      dateOfBirthUI: {
        ...currentOrPastDateUI('Date of Birth'),
      },
      addressUI: {
        ...address.uiSchema('Current Street Address', false),
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
