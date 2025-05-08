import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import VaCheckboxField from '@department-of-veterans-affairs/platform-forms-system/web-component-fields/VaCheckboxField';

import {
  pointOfContactTitle,
  pointOfContactNameLabel,
  pointOfContactCheckboxLabel,
  pointOfContactPhoneLabel,
} from '../content/livingSituation';

import { POINT_OF_CONTACT_MAX } from '../constants';

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
      pointOfContactName: { ...textSchema, maxLength: POINT_OF_CONTACT_MAX },
      pointOfContactHasInternationalPhone: { type: 'boolean' },
      pointOfContactPhone: phoneSchema,
    },
  },
};
