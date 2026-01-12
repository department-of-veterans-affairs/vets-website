import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  SpecialMonthlyPensionEvidenceAlert,
  RequestNursingHomeInformationAlert,
} from '../../../components/FormAlerts';
import { isYes } from '../../../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Nursing home or increased survivor entitlement'),
    claimingMonthlySpecialPension: yesNoUI(
      'Are you claiming special monthly pension or special monthly DIC because you need the regular assistance of another person, have severe visual problems, or are generally confined to your immediate premises?',
    ),
    needRegularAssistanceAlert: {
      'ui:description': SpecialMonthlyPensionEvidenceAlert,
      'ui:options': {
        hideIf: formData => !isYes(formData?.claimingMonthlySpecialPension),
        displayEmptyObjectOnReview: true,
      },
    },
    claimantLivesInANursingHome: yesNoUI('Are you in a nursing home?'),
    inNursingHomeAlert: {
      'ui:description': RequestNursingHomeInformationAlert,
      'ui:options': {
        hideIf: formData => !isYes(formData?.claimantLivesInANursingHome),
        displayEmptyObjectOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      claimingMonthlySpecialPension: yesNoSchema,
      needRegularAssistanceAlert: {
        type: 'object',
        properties: {},
      },
      claimantLivesInANursingHome: yesNoSchema,
      inNursingHomeAlert: {
        type: 'object',
        properties: {},
      },
    },
    required: ['claimingMonthlySpecialPension', 'claimantLivesInANursingHome'],
  },
};
