import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import createConflictPageField from '../../../components/ConflictPageField';
import { VETERAN_INFO_FIELDS } from '../../../cave/fieldMapping';

const ConfirmVeteranInfoField = createConflictPageField(
  VETERAN_INFO_FIELDS,
  'No conflicts were found between your uploaded documents and the information you entered.',
);

export default {
  uiSchema: {
    ...titleUI(
      'Confirm Veteran information',
      'The information you entered is different than what we detected in your documents. Review and confirm which information is correct.',
    ),
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
