import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import AuthorityField from '../components/AuthorityField';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { PtsdAssaultAuthoritiesDescription } from '../content/ptsdAssaultAuthorities';
import { addressUISchema } from '../utils';

const {
  sources,
} = fullSchema.properties.form0781.properties.incidents.items.properties;

export const uiSchema = index => ({
  'ui:title': ptsd781aNameTitle,
  'ui:description': PtsdAssaultAuthoritiesDescription,
  [`secondaryIncident${index}`]: {
    sources: {
      'ui:options': {
        itemName: 'Authority',
        viewField: AuthorityField,
      },
      items: {
        name: {
          'ui:title': 'Name of official or authority',
        },
        address: addressUISchema(
          `secondaryIncident${index}.sources.items.address`,
          null,
          false,
          false,
        ),
      },
    },
  },
});

export const schema = index => ({
  type: 'object',
  properties: {
    [`secondaryIncident${index}`]: {
      type: 'object',
      properties: {
        sources,
      },
    },
  },
});
