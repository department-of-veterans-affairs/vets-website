import merge from 'lodash/merge';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { veteranHomeAddress: address } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['vet-info--home-address-title'],
      content['vet-info--home-address-description'],
    ),
    veteranHomeAddress: merge({}, addressUI(null, true), {
      street: {
        'ui:title': content['contact-info--street-address-label'],
        'ui:errorMessages': {
          pattern: content['validation-error--street-address'],
        },
      },
      city: {
        'ui:errorMessages': {
          pattern: content['validation-error--city-address'],
        },
      },
      state: {
        'ui:title': content['contact-info--state-label'],
        'ui:errorMessages': {
          required: content['validation-error--state-address'],
        },
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranHomeAddress: merge(
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
    },
  },
};
