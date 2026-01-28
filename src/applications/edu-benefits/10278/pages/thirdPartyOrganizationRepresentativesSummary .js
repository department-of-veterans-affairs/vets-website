import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { organizationRepresentativesArrayOptions } from '../helpers';

const yesNoConfig = {
  title: 'Do you have another representative to add?',
  labels: {
    Y: 'Yes, I have another representative to add',
    N: 'No, I do not have another representative to add',
  },
  errorMessages: {
    required: 'Select yes if you have another representative to add.',
  },
};

export default {
  uiSchema: {
    'view:hasRepresentatives': arrayBuilderYesNoUI(
      organizationRepresentativesArrayOptions,
      yesNoConfig,
      yesNoConfig,
    ),
  },

  schema: {
    type: 'object',
    properties: {
      'view:hasRepresentatives': arrayBuilderYesNoSchema,
    },
    required: ['view:hasRepresentatives'],
  },
};
