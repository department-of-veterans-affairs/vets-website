import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import { veteranFields } from '../../../definitions/constants';
import { PreferredFacilityAPIUI } from '../../../definitions/UIDefinitions/veteranUI';

const { plannedClinic } = fullSchema.properties.veteran.properties;

const vetMedicalCenterAPIPage = {
  uiSchema: {
    [veteranFields.plannedClinic]: PreferredFacilityAPIUI,
  },
  schema: {
    type: 'object',
    required: [veteranFields.plannedClinic],
    properties: {
      [veteranFields.plannedClinic]: {
        type: 'object',
        properties: {
          plannedClinic,
        },
      },
    },
  },
};

export default vetMedicalCenterAPIPage;
