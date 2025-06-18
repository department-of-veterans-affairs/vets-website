import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  titleUI,
  descriptionUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaSelectFieldWithModal from '../../../components/FormFields/VaSelectFieldWithModal';
import MaritalStatusDescription from '../../../components/FormDescriptions/MaritalStatusDescription';
import content from '../../../locales/en/content.json';

const { maritalStatus } = ezrSchema.properties;

export default {
  uiSchema: {
    ...descriptionUI(PrefillMessage, { hideOnReview: true }),
    'view:maritalStatus': {
      ...titleUI(content['household-marital-status-title']),
      ...descriptionUI(MaritalStatusDescription, { hideOnReview: true }),
      maritalStatus: {
        'ui:title': content['household-marital-status-label'],
        'ui:webComponentField': VaSelectFieldWithModal,
        'ui:options': {
          modalConfig: {
            triggerValues: ['Married', 'Separated'],
            modalTitle: content['household-spouse-status-change-modal-title'],
            modalDescription:
              content['household-spouse-status-change-modal-text'],
            primaryButtonText:
              content[
                'household-spouse-status-change-modal-continue-button-text'
              ],
            secondaryButtonText:
              content[
                'household-spouse-status-change-modal-cancel-button-text'
              ],
          },
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:maritalStatus': {
        type: 'object',
        required: ['maritalStatus'],
        properties: {
          maritalStatus,
        },
      },
    },
  },
};
