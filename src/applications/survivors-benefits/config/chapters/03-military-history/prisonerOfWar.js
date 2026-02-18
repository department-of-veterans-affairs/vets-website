import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const prisonerOfWarPage = {
  uiSchema: {
    ...titleUI('Prisoner of war status'),
    pow: yesNoUI({
      title: 'Was the Veteran ever a prisoner of war (POW)?',
    }),
  },
  schema: {
    type: 'object',
    required: ['pow'],
    properties: {
      pow: yesNoSchema,
    },
  },
};

export default prisonerOfWarPage;
