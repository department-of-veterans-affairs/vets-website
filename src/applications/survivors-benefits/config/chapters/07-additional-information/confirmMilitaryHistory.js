import createConflictPageField from '../../../components/ConflictPageField';
import { MILITARY_HISTORY_FIELDS } from '../../../cave/fieldMapping';

const ConfirmMilitaryHistoryField = createConflictPageField(
  MILITARY_HISTORY_FIELDS,
  'No conflicts were found between your uploaded documents and your military history information.',
);

export default {
  uiSchema: {
    'ui:title': '',
    militaryHistoryConflictData: {
      'ui:field': ConfirmMilitaryHistoryField,
      'ui:validations': [
        (errors, fieldValue) => {
          if ((fieldValue?.conflictCount ?? 0) > 0) {
            errors.addError(
              'You must resolve all conflicts before continuing.',
            );
          }
        },
      ],
    },
  },
  schema: {
    type: 'object',
    properties: {
      militaryHistoryConflictData: {
        type: 'object',
        properties: {
          conflictCount: { type: 'integer' },
        },
      },
    },
  },
};
