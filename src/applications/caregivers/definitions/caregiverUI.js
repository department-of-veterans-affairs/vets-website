import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';

export default {
  'ui:title': 'Application for Caregiver Benefits',
  'ui:options': {
    hideTitle: false,
  },
  items: {
    dateOfBirth: currentOrPastDateUI('Date of Birth'),
    address: address.uiSchema('Current Street Address', false),
    telephoneNumber: phoneUI('Telephone Number (Including Area Code)'),
    cellNumber: phoneUI('Cell Number (Including Area Code)'),
    email: {
      'ui:title': 'Email Address',
      'ui:widget': 'email',
    },
    gender: {
      'ui:title': 'Gender',
      'ui:widget': 'radio',
    },
    vaEnrolled: {
      'ui:title': 'Enrolled in VA Health Care?',
      'ui:widget': 'yesNo',
    },
    plannedClinic: {
      'ui:title':
        'Name of VA medical center or clinic where you receive or plan to receive health care services:',
    },
    previousTreatmentFacility: {
      'ui:title': 'Name of facility where you last received medical treatment:',
    },
    facilityType: {
      'ui:title': 'Type of facility where you last received medical treatment:',
      'ui:widget': 'radio',
      'ui:options': { labels: { hospital: 'Hospital', clinic: 'Clinic' } },
    },
    vetRelationship: {
      'ui:title':
        'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
    },
    medicaidEnrolled: {
      'ui:title': 'Enrolled in Medicaid or Medicare?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsurance: {
      'ui:title': 'Other Health Insurance?',
      'ui:widget': 'yesNo',
    },
    otherHealthInsuranceName: {
      'ui:title': 'Other Health Insurance Name?',
    },
  },
};
