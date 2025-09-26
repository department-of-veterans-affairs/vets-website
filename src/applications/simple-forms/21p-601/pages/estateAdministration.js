import {
  titleUI,
  yesNoUI,
  yesNoSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('Estate administration'),
    estateBeingAdministered: yesNoUI(
      'Is the estate of the deceased being administered?',
    ),
    'ui:description':
      'Select yes if there is an executor, administrator, or legal representative handling the estate.',
    courtAppointedRepresentative: {
      ...textUI('Name of court-appointed representative'),
      'ui:options': {
        expandUnder: 'estateBeingAdministered',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      estateBeingAdministered: yesNoSchema,
      courtAppointedRepresentative: textSchema,
    },
  },
};
