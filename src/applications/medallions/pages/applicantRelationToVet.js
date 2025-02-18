import { radioSchema } from 'platform/forms-system/src/js/web-component-patterns';

import {
  //   finishAppLaterLink,
  applicantRelationToVetHeaders,
  applicantRelationToVetRadio,
  validateVetRadioOtherComment,
} from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantRelationToVetHeaders,
    relationToVetRadio: applicantRelationToVetRadio.relationToVetRadio,
    otherRelation: {
      'ui:title': 'Describe your relationship to the Veteran',
      'ui:widget': 'textarea',
      'ui:required': formData => formData.relationToVetRadio === 'other',
      'ui:options': {
        expandUnder: 'relationToVetRadio',
        hideIf: formData => formData.relationToVetRadio !== 'other',
      },
      'ui:errorMessages': {
        required: 'You must provide a response',
        pattern: 'Only alphabetic characters are allowed',
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
        maxLength: 50,
        pattern: '^[A-Za-z\\s]+$',
      },
    },
  },
  validateVetRadioOtherComment,
};
