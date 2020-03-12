import { genericSchemas } from '../../../generic-schema';
import { suffixes } from '../../../constants';

export const schema = {
  type: 'object',
  properties: {
    children: {
      type: 'array',
      minItems: 1,
      Items: {
        type: 'object',
        properties: {
          first: genericSchemas.genericTextInput,
          middle: genericSchemas.genericTextInput,
          last: genericSchemas.genericTextInput,
          suffix: {
            type: 'string',
            enum: suffixes,
          },
          ssn: genericSchemas.genericNumberAndDashInput,
          birthDate: genericSchemas.date,
        }
      },
    },
  },
}

export const uiSchema = {

}