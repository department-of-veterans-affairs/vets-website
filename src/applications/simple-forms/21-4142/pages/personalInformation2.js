import {
  ssnUI,
  vaFileNumberUI,
  serviceNumberUI,
  ssnSchema,
  vaFileNumberSchema,
  serviceNumberSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';

/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      [veteranFields.ssn]: ssnUI(),
      [veteranFields.vaFileNumber]: vaFileNumberUI(),
      [veteranFields.veteranServiceNumber]: serviceNumberUI(
        'VA service number',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.parentObject]: {
        type: 'object',
        required: [veteranFields.ssn],
        properties: {
          [veteranFields.ssn]: ssnSchema,
          [veteranFields.vaFileNumber]: vaFileNumberSchema,
          [veteranFields.veteranServiceNumber]: serviceNumberSchema,
        },
      },
    },
  },
};
