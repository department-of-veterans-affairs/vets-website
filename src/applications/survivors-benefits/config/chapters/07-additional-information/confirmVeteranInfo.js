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
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranInfoConflictData: {
        type: 'object',
        properties: {},
      },
    },
  },
};
