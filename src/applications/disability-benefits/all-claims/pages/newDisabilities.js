import { increaseAndNewAlert } from '../content/addDisabilities';
import { requireNewDisability } from '../validations';
import { claimingRated } from '../utils';

export const uiSchema = {
  'view:newDisabilities': {
    'ui:title': 'Do you have any new conditions you want to add to your claim?',
    'ui:widget': 'yesNo',
    'ui:validations': [requireNewDisability],
  },
  'view:noSelectedAlert': {
    'ui:description': increaseAndNewAlert,
    'ui:options': {
      hideIf: claimingRated,
    },
  },
};

export const schema = {
  type: 'object',
  required: ['view:newDisabilities'],
  properties: {
    'view:newDisabilities': {
      type: 'boolean',
    },
    'view:noSelectedAlert': { type: 'object', properties: {} },
  },
};
