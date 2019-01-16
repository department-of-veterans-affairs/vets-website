import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { PTSD_CHANGE_LABELS } from '../constants';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { changeDescription } from '../content/mentalHealthChanges';

const { mentalChanges } = fullSchema.properties;

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': changeDescription,
  mentalChanges: {
    depression: {
      'ui:title': PTSD_CHANGE_LABELS.depression,
    },
    obsessive: {
      'ui:title': PTSD_CHANGE_LABELS.obsessive,
    },
    prescription: {
      'ui:title': PTSD_CHANGE_LABELS.prescription,
    },
    substance: {
      'ui:title': PTSD_CHANGE_LABELS.substance,
    },
    hypervigilance: {
      'ui:title': PTSD_CHANGE_LABELS.hypervigilance,
    },
    agoraphobia: {
      'ui:title': PTSD_CHANGE_LABELS.agoraphobia,
    },
    fear: {
      'ui:title': PTSD_CHANGE_LABELS.fear,
    },
    other: {
      'ui:title': 'Other',
    },
    otherExplanation: {
      'ui:title': 'Please describe',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        expandUnder: 'other',
      },
    },
    noneApply: {
      'ui:title': 'None of these apply to me',
    },
  },
};

export const schema = {
  type: 'object',
  properties: { mentalChanges },
};
