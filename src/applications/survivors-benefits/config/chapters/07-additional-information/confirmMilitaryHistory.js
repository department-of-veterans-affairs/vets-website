import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import createConflictPageField from '../../../components/ConflictPageField';
import { MILITARY_HISTORY_FIELDS } from '../../../cave/fieldMapping';

const ConfirmMilitaryHistoryField = createConflictPageField(
  MILITARY_HISTORY_FIELDS,
  'No conflicts were found between your uploaded documents and your military history information.',
);

export default {
  uiSchema: {
    ...titleUI(
      'Confirm Veteran military history',
      'The information you entered is different than what we detected in your documents. Review and confirm which information is correct.',
    ),
    militaryHistoryConflictData: {
      'ui:field': ConfirmMilitaryHistoryField,
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryHistoryConflictData: {
        type: 'object',
        properties: {},
      },
    },
  },
};
