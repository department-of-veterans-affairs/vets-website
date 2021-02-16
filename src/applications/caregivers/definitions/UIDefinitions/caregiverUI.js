import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import { shouldHideAlert } from 'applications/caregivers/helpers';
import {
  AdditionalCaregiverInfo,
  SecondaryRequiredAlert,
} from 'applications/caregivers/components/AdditionalInfo';

export const primaryInputLabel = 'Primary Family Caregiver\u2019s';

export const primaryPhoneNumberUI = label =>
  phoneUI(`${label}  primary telephone number (including area code)`);

export const hasHealthInsurance = {
  'ui:title':
    'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
  'ui:widget': 'yesNo',
};

export const secondaryOneInputLabel = 'Secondary Family Caregiver\u2019s';
export const secondaryTwoInputLabel = 'Secondary Family Caregiver\u2019s (2)';
export const secondaryTwoChapterTitle =
  'Secondary Family Caregiver\u2019s (2) applicant information';

export const hasSecondaryCaregiverTwoUI = {
  'ui:title': ' ',
  'ui:description': AdditionalCaregiverInfo,
  'ui:widget': 'yesNo',
};

export const secondaryRequiredAlert = {
  'ui:title': ' ',
  'ui:widget': SecondaryRequiredAlert,
  'ui:options': {
    hideIf: formData => shouldHideAlert(formData),
  },
};
