import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const terminationDateUI = currentOrPastDateUI();
terminationDateUI['ui:title'] = 'When did your remarriage end?';
terminationDateUI['ui:required'] = () => true;

export default {
  uiSchema: {
    ...titleUI('Details on end of remarriage'),
    hideFormTitle: true,
    remarriage: {
      terminationDate: terminationDateUI,
      terminationReason: textUI({
        title: 'Why did your marriage end?',
        hint: 'For example: Death, divorce',
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
