import {
  arrayBuilderItemFirstPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { ARRAY_PATH, NEW_CONDITION_OPTION } from '../../constants';

import {
  arrayOptions,
  createRatedDisabilityDescriptions,
  getRemainingRatedDisabilities,
} from './shared/utils';
import { updateClaimTypeFromArray } from './shared/claimType';

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Add a condition',
      nounSingular: arrayOptions.nounSingular,
    }),
    ratedDisability: radioUI({
      title: 'What condition would you like to add?',
      hint:
        "Choose one. You'll return to this screen later if you need to add more.",
      updateSchema: (formData, _schema, uiSchema, index, _path, fullData) => {
        const remaining = getRemainingRatedDisabilities(fullData, index);

        // Prefer the user’s in-flight choice but fall back to persisted
        const persisted = fullData?.[ARRAY_PATH]?.[index]?.ratedDisability;
        const currentValue = formData?.ratedDisability ?? persisted ?? null;

        let options;

        if (remaining.length === 0) {
          // Last one just got picked (or we're in the transient state):
          // Build from the full rated list so the chosen value is always valid.
          // Do NOT offer NEW_CONDITION_OPTION here.
          const allRated = (fullData?.ratedDisabilities || []).map(d => d.name);
          options =
            currentValue && !allRated.includes(currentValue)
              ? [...allRated, currentValue]
              : allRated;
        } else {
          // Normal case: show remaining + NEW_CONDITION_OPTION; also reinsert current if filtered out
          const base = [NEW_CONDITION_OPTION, ...remaining];
          options =
            currentValue && !base.includes(currentValue)
              ? [...base, currentValue]
              : base;
        }

        // Keep descriptions injection
        const descriptions = createRatedDisabilityDescriptions(fullData || {});
        // eslint-disable-next-line no-param-reassign
        uiSchema['ui:options'] = {
          ...(uiSchema['ui:options'] || {}),
          descriptions,
        };

        return radioSchema(options);
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      ratedDisability: radioSchema(['error']),
    },
    required: ['ratedDisability'],
  },
  updateFormData: updateClaimTypeFromArray,
};

export default conditionPage;
