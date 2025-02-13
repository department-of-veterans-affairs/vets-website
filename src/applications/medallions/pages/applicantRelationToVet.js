import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  //   finishAppLaterLink,
  applicantRelationToVetHeaders,
} from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantRelationToVetHeaders,
    relationToVetRadio: radioUI({
      title: 'What’s your relationship to the Veteran?',
      labels: {
        familyMember: 'Family member',
        personalRep: 'Personal representative',
        repOfVSO: 'Representative of Veterans Service Organization (VSO)',
        repOfCemetary: 'Representative of a cemetery',
        repOfFuneralHome: 'Representative of a funeral home',
        other: 'Other',
      },
      required: () => true,
      errorMessages: {
        required: 'Please select an option',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      relationToVetRadio: radioSchema([
        'familyMember',
        'personalRep',
        'repOfVSO',
        'repOfCemetary',
        'repOfFuneralHome',
        'other',
      ]),
    },
  },
};
