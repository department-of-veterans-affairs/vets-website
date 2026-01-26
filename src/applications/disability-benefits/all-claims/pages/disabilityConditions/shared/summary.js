import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayOptions, createNewConditionName } from './utils';
import ConfirmationNewAndRatedConditions from '../../../components/confirmationFields/ConfirmationNewAndRatedConditions';

const isOrphanSecondary = (item, fullData = {}) => {
  if (!item || item.cause !== 'SECONDARY') return false;
  const norm = s => (typeof s === 'string' ? s.trim().toLowerCase() : '');
  const target = norm(item.causedByDisability);
  if (!target) return true;

  const newNames = (fullData?.newDisabilities ?? [])
    .map(it =>
      norm(
        it?.condition
          ? createNewConditionName(it, true)
          : it?.newCondition ?? it?.name,
      ),
    )
    .filter(Boolean);

  const ratedNames = (fullData?.ratedDisabilities ?? [])
    .map(d => norm(d?.name))
    .filter(Boolean);

  return !(newNames.includes(target) || ratedNames.includes(target));
};

const summaryPage = {
  uiSchema: {
    'view:hasConditions': {
      ...arrayBuilderYesNoUI(arrayOptions, {}, { hint: null }),
      'ui:validations': [
        (errors, fieldData, formData) => {
          const orphans =
            (formData?.newDisabilities || []).filter(d =>
              isOrphanSecondary(d, formData),
            ) || [];
          if (orphans.length > 0) {
            errors.addError(
              'A secondary condition is no longer linked to an existing condition. Please delete it, relink it to a current condition, or update its cause.',
            );
          }
        },
      ],
    },
    'ui:confirmationField': ConfirmationNewAndRatedConditions,
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasConditions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasConditions'],
  },
};

export default summaryPage;
