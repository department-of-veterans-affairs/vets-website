import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const terminationDateUI = currentOrPastDateUI();
terminationDateUI['ui:title'] = 'Date marriage ended';
terminationDateUI['ui:required'] = () => true;

export default {
  uiSchema: {
    ...titleUI('End of marriage details'),
    hideFormTitle: true,
    remarriage: {
      terminationDate: terminationDateUI,
      terminationReason: textUI({
        title: 'Reason marriage ended (i.e., death, divorce)',
        required: () => true,
      }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      remarriage: {
        type: 'object',
        required: ['terminationDate', 'terminationReason'],
        properties: {
          terminationDate: currentOrPastDateSchema,
          terminationReason: textSchema,
        },
      },
    },
  },
};
