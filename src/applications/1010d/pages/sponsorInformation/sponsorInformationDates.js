import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { veteranFields } from '../../../caregivers/definitions/constants';

import fullSchema from '../../10-10D-schema.json';

const { veteran } = fullSchema.properties;

export default {
  uiSchema: {
    [veteranFields.dateOfBirth]: currentOrPastDateUI('Date of birth'),
    [veteranFields.dateOfMarriage]: currentOrPastDateUI('Date of marriage'),
    [veteranFields.isDeceased]: {
      'ui:title': 'Is the Veteran deceased?',
      'ui:required': () => true,
      'ui:widget': 'yesNo',
    },
    [veteranFields.dateOfDeath]: {
      ...currentOrPastDateUI('Date of death'),
      'ui:options': {
        hideIf: formData => !formData[veteranFields.isDeceased],
      },
    },
    [veteranFields.isActiveServiceDeath]: {
      'ui:title': "Was the Veteran's death during active service?",
      'ui:options': {
        hideIf: formData => !formData[veteranFields.isDeceased],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      [veteranFields.dateOfBirth]: veteran.properties.dateOfBirth,
      [veteranFields.dateOfMarriage]: veteran.properties.dateOfMarriage,
      [veteranFields.isDeceased]: veteran.properties.isDeceased,
      [veteranFields.dateOfDeath]: veteran.properties.dateOfDeath,
      [veteranFields.isActiveServiceDeath]:
        veteran.properties.isActiveServiceDeath,
    },
  },
};
