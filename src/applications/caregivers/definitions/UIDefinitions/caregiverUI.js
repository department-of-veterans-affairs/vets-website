import { shouldHideAlert } from 'applications/caregivers/helpers';
import {
  AdditionalCaregiverInfo,
  SecondaryRequiredAlert,
} from 'applications/caregivers/components/AdditionalInfo';

export const primaryInputLabel = 'Primary Family Caregiver\u2019s';
export const secondaryOneInputLabel = 'Secondary Family Caregiver\u2019s';
export const secondaryTwoInputLabel = 'Secondary Family Caregiver\u2019s (2)';

export const hasHealthInsurance = {
  'ui:title':
    'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
  'ui:widget': 'yesNo',
};

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
