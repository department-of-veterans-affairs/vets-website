import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ptsdLocationDescription } from '../content/incidentLocation';
import { incidentLocationSchemas } from '../utils';

const { addressUI, addressSchema } = incidentLocationSchemas();

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': ptsdLocationDescription,
  [`secondaryIncident${index}`]: {
    incidentLocation: addressUI,
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        incidentLocation: addressSchema,
      },
    },
  },
});
