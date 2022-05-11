import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ptsdLocationDescription } from '../content/incidentLocation';
import { incidentLocationUISchema } from '../utils/schemas';

const {
  incidentLocation,
} = fullSchema.properties.form0781.properties.incidents.items.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': ptsdLocationDescription,
  [`incident${index}`]: {
    incidentLocation: incidentLocationUISchema(
      `incident${index}.incidentLocation`,
    ),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incident${index}`]: {
      type: 'object',
      properties: {
        incidentLocation,
      },
    },
  },
});
