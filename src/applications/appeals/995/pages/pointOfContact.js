import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxField';

import {
  pointOfContactTitle,
  pointOfContactNameLabel,
  pointOfContactCheckboxLabel,
  pointOfContactPhoneLabel,
} from '../content/livingSituation';

export const baseUiSchemaErrors = {
  phone: phoneUI()['ui:errorMessages'],
  international: internationalPhoneUI()['ui:errorMessages'],
};

export default {
  uiSchema: {
    'view:pointOfContact': {
      'ui:description': pointOfContactTitle,
    },
    pointOfContactName: textUI({
      title: pointOfContactNameLabel,
      classNames: 'vads-u-margin-bottom--4',
    }),
    pointOfContactHasInternationalPhone: {
      'ui:title': pointOfContactCheckboxLabel,
      'ui:webComponentField': VaCheckboxField,
      'ui:options': {
        hideOnReview: true,
      },
    },
    pointOfContactPhone: phoneUI({
      title: pointOfContactPhoneLabel,
      classNames: 'vads-u-margin-bottom--4',
      updateUiSchema: (_fieldData, fullData = {}) => ({
        'ui:errorMessages': fullData.pointOfContactHasInternationalPhone
          ? baseUiSchemaErrors.international
          : baseUiSchemaErrors.phone,
      }),
      updateSchema: (
        _formData,
        _schema,
        _uiSchema,
        _index,
        _path,
        fullData = {},
      ) =>
        fullData.pointOfContactHasInternationalPhone
          ? internationalPhoneSchema
          : phoneSchema,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pointOfContact': {
        type: 'object',
        properties: {},
      },
      pointOfContactName: textSchema,
      pointOfContactHasInternationalPhone: { type: 'boolean' },
      pointOfContactPhone: phoneSchema,
    },
  },
};
