import createConflictPageField from '../../../components/ConflictPageField';
import { VETERAN_INFO_FIELDS } from '../../../cave/fieldMapping';

const ConfirmVeteranInfoField = createConflictPageField(
  VETERAN_INFO_FIELDS,
  'No conflicts were found between your uploaded documents and the information you entered.',
);

export default {
  uiSchema: {
    'ui:title': '',
    veteranInfoConflictData: {
      'ui:field': ConfirmVeteranInfoField,
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
      veteranInfoConflictData: {
        type: 'object',
        properties: {
          conflictCount: { type: 'integer' },
        },
      },
    },
  },
};
