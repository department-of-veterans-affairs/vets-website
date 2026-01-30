// @ts-check
import merge from 'lodash/merge';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { veteranAddress: address } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(
      content['vet-info--mailing-address-title'],
      content['vet-info--mailing-address-description'],
    ),
    veteranAddress: merge({}, addressUI(null, true), {
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
    'view:doesMailingMatchHomeAddress': yesNoUI({
      title: content['vet-info--address-match-label'],
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranAddress: merge(
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
      'view:doesMailingMatchHomeAddress': yesNoSchema,
    },
  },
};
