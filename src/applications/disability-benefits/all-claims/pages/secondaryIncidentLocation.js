import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { ptsdLocationDescription } from '../content/incidentLocation';
import { incidentLocationSchemas } from '../utils';

const { addressUI, addressSchema } = incidentLocationSchemas();

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': ptsdLocationDescription,
  [`secondaryIncidentLocation${index}`]: addressUI,
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncidentLocation${index}`]: addressSchema,
  },
});
