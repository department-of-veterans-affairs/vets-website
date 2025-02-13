import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    // ...titleUI(
    //   'Mailing address',
    //   'We’ll send any important information about your application to this address.',
    // ),
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
        required: 'Please select an animal',
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
