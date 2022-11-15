import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullSchema from '../../10-10D-schema.json';

const { veteran } = fullSchema.properties;

const veteranFields = {
  dob: 'dateOfBirth',
  dom: 'dateOfMarriage',
  dod: 'dateOfDeath',
};

export default {
  uiSchema: {
    [veteranFields.dob]: currentOrPastDateUI('Date of birth'),
    [veteranFields.dom]: currentOrPastDateUI('Date of marriage'),
    [veteranFields.dod]: currentOrPastDateUI('Date of death'),
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.dob]: veteran.properties.dateOfBirth,
      [veteranFields.dom]: veteran.properties.dateOfMarriage,
      [veteranFields.dod]: veteran.properties.dateOfDeath,
    },
  },
};
