import {
  yesNoSchema,
  yesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
const prisonerOfWarPage = {
  title: 'Prisoner of war',
  path: 'veteran/prisoner-of-war',
  depends: formData => formData.nationalGuardActivated === true,
  uiSchema: {
    ...titleUI('Prisoner of war status'),
    prisonerOfWar: yesNoUI({
      title: 'Was the Veteran ever a prisoner of war (POW)?',
    }),
  },
  schema: {
    type: 'object',
    required: ['prisonerOfWar'],
    properties: {
      prisonerOfWar: yesNoSchema,
    },
  },
};

export default prisonerOfWarPage;
