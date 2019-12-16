import * as address from 'platform/forms-system/src/js/definitions/address';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import ServicePeriodView from '../../../platform/forms/components/ServicePeriodView';

export default {
  'ui:title': 'Caregiver Information',
  'ui:options': {
    itemName: 'Service Period',
    viewField: ServicePeriodView,
    hideTitle: true,
  },
  items: {
    dateOfBirth: currentOrPastDateUI('Date of Birth'),
    address: address.uiSchema('Current Street Address', false),
    telephoneNumber: phoneUI('Telephone Number (Including Area Code)'),
    cellNumber: phoneUI('Cell Number (Including Area Code)'),
    email: {
      'ui:title': 'Email Address',
    },
    gender: {
      'ui:title': 'Gender',
    },
    vaEnrolled: {
      'ui:title': 'Enrolled in VA Health Care?',
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
    },
    vetRelationship: {
      'ui:title':
        'Relationship to Veteran (e.g., Spouse, Parent, Child, Other):',
    },
    medicaidEnrolled: {
      'ui:title': 'Enrolled in Medicaid or Medicare?',
    },
    otherHealthInsurance: {
      'ui:title': 'Other Health Insurance?',
    },
    otherHealthInsuranceName: {
      'ui:title': 'Other Health Insurance Name?',
    },
  },
};
