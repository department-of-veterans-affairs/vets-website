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
    ssnUI: {
      ...ssnUI,
      'ui:title': `Veteran's Social Security Number/Tax Identification Number`,
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    previousTreatmentFacilityUI: {
      'ui:title': 'Name of facility where you last received medical treatment:',
      'ui:order': ['name', 'type'],
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
    [vetFields.preferredFacilityView]: {
      [vetFields.preferredFacilityStateView]: {
        'ui:title': 'Facility State',
        'ui:options': {
          labels: stateLabels,
        },
      },
      [vetFields.plannedClinic]: {
        'ui:title': 'Preferred Clinic or Hospital',
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
      'ui:title': 'Enrolled in Medicaid?',
      'ui:widget': 'yesNo',
    },
    medicareEnrolledUI: {
      'ui:title': 'Enrolled in Medicare?',
      'ui:widget': 'yesNo',
    },
    tricareEnrolledUI: {
      'ui:title': 'Enrolled in Tricare?',
      'ui:widget': 'yesNo',
    },
    champvaEnrolledUI: {
      'ui:title': 'Enrolled in CHAMPVA?',
      'ui:widget': 'yesNo',
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
