import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { veteranFields } from '../../../caregivers/definitions/constants';

import fullSchema from '../../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    [veteranFields.dateOfBirth]: currentOrPastDateUI('Date of birth'),
    [veteranFields.dateOfMarriage]: currentOrPastDateUI('Date of marriage'),
    [veteranFields.dateOfDeath]: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.dateOfBirth]: veteran.properties.dateOfBirth,
      [veteranFields.dateOfMarriage]: veteran.properties.dateOfMarriage,
      [veteranFields.dateOfDeath]: veteran.properties.dateOfDeath,
    },
  },
};
