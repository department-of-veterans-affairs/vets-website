import {
  dateOfBirthSchema,
  dateOfBirthUI,
  fullNameSchema,
  fullNameUI,
  serviceNumberSchema,
  serviceNumberUI,
  ssnSchema,
  ssnUI,
  titleUI,
  vaFileNumberSchema,
  vaFileNumberUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { veteranFields } from '../definitions/constants';
import { getFullNameLabels } from '../helpers';




/** @type {PageSchema} */
export default {
  uiSchema: {
    [veteranFields.parentObject]: {
      ...titleUI({
        title: 'Basic Information',
      }),
      [veteranFields.fullName]: {
        ...fullNameUI(label =>
          getFullNameLabels(label, false),
        ),
      },
      [veteranFields.ssn]: ssnUI(),
      [veteranFields.vaFileNumber]: vaFileNumberUI(),
      [veteranFields.dateOfBirth]: dateOfBirthUI(),
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
        properties: {
          [veteranFields.fullName]: fullNameSchema,
          [veteranFields.vaFileNumber]: vaFileNumberSchema,
          [veteranFields.ssn]: ssnSchema,
          [veteranFields.dateOfBirth]: dateOfBirthSchema,
          [veteranFields.veteranServiceNumber]: serviceNumberSchema,
        },
        required: [
          veteranFields.fullName,
          veteranFields.ssn,
          veteranFields.dateOfBirth,
        ],
      },
    },
  },
};
