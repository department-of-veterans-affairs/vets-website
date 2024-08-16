import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  primaryMailingAddressOptions,
  primaryMailingAddressOptionsNoWork,
} from '../../constants/options';

const getUiOptions = formData => ({
  'ui:options': {
    labels: formData.workAddress.country
      ? primaryMailingAddressOptions
      : primaryMailingAddressOptionsNoWork,
  },
});

const getSchemaOptions = formData =>
  radioSchema(
    Object.keys(
      formData.workAddress.country
        ? primaryMailingAddressOptions
        : primaryMailingAddressOptionsNoWork,
    ),
  );

/** @type {PageSchema} */
export default {
  title: 'Primary mailing address',
  path: 'primary-mailing-address',
  uiSchema: {
    ...titleUI('Primary mailing address'),
    primaryMailingAddress: radioUI({
      title:
        'What address would you like to receive communication from the Office of General Counsel (OGC)?',
      labels: primaryMailingAddressOptionsNoWork,
      updateUiSchema: formData => getUiOptions(formData),
      updateSchema: formData => getSchemaOptions(formData),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      primaryMailingAddress: radioSchema(
        Object.keys(primaryMailingAddressOptionsNoWork),
      ),
    },
    required: ['primaryMailingAddress'],
  },
};
