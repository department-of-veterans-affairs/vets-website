import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';

import {
  //   finishAppLaterLink,
  applicantRelationToVetHeaders,
  applicantRelationToVetRadio,
} from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantRelationToVetHeaders,
    relationToVetRadio: applicantRelationToVetRadio.relationToVetRadio,
    otherRelation: {
      'ui:title': 'Describe your relationship to the Veteran',
      'ui:widget': 'textarea',
      'ui:options': {
        expandUnder: 'relationToVetRadio',
        hideIf: formData => formData.relationToVetRadio !== 'other',
      },
    },
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
      otherRelation: {
        type: 'string',
        title: 'Please specify your relationship to the Veteran',
        required: ['otherRelation'],
      },
    },
  },
};
