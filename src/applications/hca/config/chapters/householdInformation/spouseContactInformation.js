import merge from 'lodash/merge';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { spouseAddress: address, spousePhone } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['household-info--spouse-contact-info-title']),
    spouseAddress: merge({}, addressUI(null, true), {
      street: {
        'ui:title': content['contact-info--street-address-label'],
        'ui:errorMessages': {
          pattern: content['validation-error--street-address'],
        },
      },
      city: {
        'ui:errorMessages': {
          pattern: content['validation-error--city'],
        },
      },
      state: {
        'ui:title': content['contact-info--state-label'],
        'ui:errorMessages': {
          required: content['validation-error--state'],
        },
      },
    }),
    spousePhone: phoneUI(content['contact-info--phone-label']),
  },
  schema: {
    type: 'object',
    properties: {
      spouseAddress: merge(
        {},
        addressSchema({ definitions: { address } }, true),
        {
          properties: {
            city: {
              minLength: 1,
              maxLength: 30,
            },
          },
        },
      ),
      spousePhone,
    },
  },
};
