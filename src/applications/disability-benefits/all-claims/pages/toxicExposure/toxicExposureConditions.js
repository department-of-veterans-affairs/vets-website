import { checkboxGroupSchema } from 'platform/forms-system/src/js/web-component-patterns';
import {
  conditionsDescription,
  conditionsPageTitle,
  conditionsQuestion,
  makeTEConditionsSchema,
  makeTEConditionsUISchema,
  validateTEConditions,
} from '../../content/toxicExposure';
import { formTitle, makeConditionsUI } from '../../utils';
import ToxicExposureConditions from '../../components/confirmationFields/ToxicExposureConditions';

const getCleanTEConditionsSchema = (...args) => {
  const schema = makeTEConditionsSchema(...args);

  if (schema?.properties) {
    const slug = s =>
      String(s || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    const out = {};

    for (const [key, def] of Object.entries(schema.properties)) {
      const keySlug = slug(key);
      const titleSlug = slug(def?.title);
      if (keySlug === 'rateddisability' || titleSlug === 'rateddisability')
        // eslint-disable-next-line no-continue
        continue;
      out[key] = def;
    }

    schema.properties = out;
  }

  return schema;
};

export const uiSchema = {
  'ui:title': formTitle(conditionsPageTitle),
  toxicExposure: {
    conditions: makeConditionsUI({
      title: conditionsQuestion,
      description: conditionsDescription,
      replaceSchema: getCleanTEConditionsSchema,
      updateUiSchema: makeTEConditionsUISchema,
    }),
  },
  'ui:validations': [validateTEConditions],
  'ui:confirmationField': ToxicExposureConditions,
};

export const schema = {
  type: 'object',
  properties: {
    toxicExposure: {
      type: 'object',
      properties: {
        conditions: checkboxGroupSchema([]),
      },
    },
  },
};
