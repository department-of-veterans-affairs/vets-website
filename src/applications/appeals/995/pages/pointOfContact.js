import {
  textUI,
  textSchema,
  phoneUI,
  phoneSchema,
  internationalPhoneUI,
  internationalPhoneSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  pointOfContactTitle,
  pointOfContactNameLabel,
  pointOfContactPhoneLabel,
} from '../content/livingSituation';

import { POINT_OF_CONTACT_MAX } from '../constants';

export default {
  uiSchema: {
    'view:pointOfContact': {
      'ui:description': pointOfContactTitle,
    },
    pointOfContactName: textUI({
      title: pointOfContactNameLabel,
      classNames: 'vads-u-margin-bottom--4',
    }),
    pointOfContactPhone: internationalPhoneUI({
      title: pointOfContactPhoneLabel,
      classNames: 'vads-u-margin-bottom--4',
      // updateUiSchema: _fieldData => ({
      //   'ui:errorMessages': internationalPhoneUI()['ui:errorMessages'],
      // }),
      // updateSchema: (_formData, _schema, _uiSchema, _index, _path) =>
      //   internationalPhoneSchema,
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
      pointOfContactPhone: internationalPhoneSchema(),
    },
  },
};
