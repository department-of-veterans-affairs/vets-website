import {
  arrayBuilderItemFirstPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { NEW_CONDITION_OPTION } from '../../constants';
import {
  arrayBuilderOptions,
  createNonSelectedRatedDisabilities,
  createRatedDisabilityDescriptions,
} from '../shared/utils';

const createRatedDisabilitySchema = fullData =>
  ({
    [NEW_CONDITION_OPTION]: NEW_CONDITION_OPTION,
    ...createNonSelectedRatedDisabilities(fullData),
  } || {});

/** @returns {PageSchema} */
const conditionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of condition',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    ratedDisability: radioUI({
      title:
        'Select if you’d like to add a new condition or select which of your service-connected disabilities have worsened.',
      hint:
        'Choose one, you will return to this screen if you need to add more.',

      updateSchema: (_formData, _schema, uiSchema, _index, _path, fullData) => {
        const options = Object.keys(createRatedDisabilitySchema(fullData));
        const descriptions = createRatedDisabilityDescriptions(fullData);

        // Inject descriptions directly into uiSchema at schema update time
        // Temporary eslint fix to address the form system’s dynamic schema injection pattern
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
};

export default conditionPage;
