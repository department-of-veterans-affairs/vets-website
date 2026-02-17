import { arrayBuilderItemSubsequentPageTitleUI } from 'platform/forms-system/src/js/web-component-patterns';
import MedicareParticipantField from '../../components/FormFields/MedicareParticipantField';
import content from '../../locales/en/content.json';

export default {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      content['medicare--participant-title'],
    ),
    medicareParticipant: {
      'ui:title': content['medicare--participant-label'],
      'ui:webComponentField': MedicareParticipantField,
      'ui:options': {
        hint: content['medicare--participant-hint'],
      },
    },
  },
  schema: {
    type: 'object',
    required: ['medicareParticipant'],
    properties: {
      medicareParticipant: { type: 'string' },
    },
  },
};
