import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { ServiceConnectedDisabilityDescription } from '../../content/newConditions';
import { createItemName, getOtherConditions } from './utils';

export const causeOptions = {
  NEW:
    'My condition was caused by an injury or exposure during my military service.',
  SECONDARY:
    'My condition was caused by another service-connected disability I already have. (For example, I have a limp that caused lower-back problems.)',
  WORSENED:
    'My condition existed before I served in the military, but it got worse because of my military service.',
  VA:
    'My condition was caused by an injury or event that happened when I was receiving VA care.',
};

export const causeWithoutSecondaryOptions = {
  NEW:
    'My condition was caused by an injury or exposure during my military service.',
  WORSENED:
    'My condition existed before I served in the military, but it got worse because of my military service.',
  VA:
    'My condition was caused by an injury or event that happened when I was receiving VA care.',
};

// TODO: Get index from path
const getUiOptions = formData => ({
  'ui:options': {
    labels: getOtherConditions(formData, 0).length
      ? causeOptions
      : causeWithoutSecondaryOptions,
  },
});

// TODO: Get index from path
const getSchemaOptions = formData =>
  radioSchema(
    Object.keys(
      getOtherConditions(formData, 0).length
        ? causeOptions
        : causeWithoutSecondaryOptions,
    ),
  );

/** @returns {PageSchema} */
const causePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Cause of ${createItemName(formData)}`,
    ),
    cause: radioUI({
      title: 'What caused your condition?',
      labels: causeOptions,
      updateUiSchema: formData => getUiOptions(formData),
      updateSchema: formData => getSchemaOptions(formData),
    }),
    'view:serviceConnectedDisabilityDescription': {
      'ui:description': ServiceConnectedDisabilityDescription,
    },
  },
  schema: {
    type: 'object',
    properties: {
      cause: radioSchema(Object.keys(causeOptions)),
      'view:serviceConnectedDisabilityDescription': {
        type: 'object',
        properties: {},
      },
    },
    required: ['cause'],
  },
};

export default causePage;
