import { ptsd781NameTitle } from '../content/ptsdClassification';
import { ptsdLocationDescription } from '../content/incidentLocation';
import { incidentLocationSchemas } from '../utils';

const { addressUI, addressSchema } = incidentLocationSchemas();

export const uiSchema = index => ({
  'ui:title': ptsd781NameTitle,
  'ui:description': ptsdLocationDescription,
  [`incidentLocation${index}`]: addressUI,
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`incidentLocation${index}`]: addressSchema,
  },
});
