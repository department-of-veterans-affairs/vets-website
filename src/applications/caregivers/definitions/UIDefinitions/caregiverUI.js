import { shouldHideAlert } from '../../utils/helpers';
import {
  AdditionalCaregiverDescription,
  HeathCareCoverageDescription,
} from '../../components/FormDescriptions';
import { SecondaryRequiredAlert } from '../../components/FormAlerts';

export const primaryInputLabel = 'Primary Family Caregiver\u2019s';
export const secondaryOneInputLabel = 'Secondary Family Caregiver\u2019s';
export const secondaryTwoInputLabel = 'Secondary Family Caregiver\u2019s (2)';

export const hasHealthInsurance = {
  'ui:title':
    'Does the Primary Family Caregiver applicant have health care coverage, such as Medicaid, Medicare, CHAMPVA, Tricare, or private insurance?',
  'ui:description': HeathCareCoverageDescription,
  'ui:widget': 'yesNo',
};

export const secondaryTwoChapterTitle =
  'Secondary Family Caregiver (2) applicant information';

export const hasSecondaryCaregiverTwoUI = {
  'ui:description': AdditionalCaregiverDescription,
  'ui:widget': 'yesNo',
  'ui:options': {
    hideLabelText: true,
  },
};

export const secondaryRequiredAlert = {
  'ui:title': ' ',
  'ui:widget': SecondaryRequiredAlert,
  'ui:options': {
    hideIf: formData => shouldHideAlert(formData),
  },
};
