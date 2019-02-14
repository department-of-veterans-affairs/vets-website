import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ptsdLocationDescription } from '../content/incidentLocation';
import { incidentLocationUISchema } from '../utils';

const {
  address,
} = fullSchema.properties.form0781.properties.incidents.items.properties.sources.items.properties;

delete address.required;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': ptsdLocationDescription,
  [`secondaryIncident${index}`]: {
    incidentLocation: incidentLocationUISchema(
      `incident${index}.incidentLocation`,
    ),
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        incidentLocation: address,
      },
    },
  },
});
