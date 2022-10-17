import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import AuthorityField from '../components/AuthorityField';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { PtsdAssaultAuthoritiesDescription } from '../content/ptsdAssaultAuthorities';
import { addressUISchema } from '../utils/schemas';

const {
  sources,
} = fullSchema.properties.form0781.properties.incidents.items.properties;

export const uiSchema = index => {
  const addressUI = addressUISchema(
    `secondaryIncident${index}.sources[:index]address`,
    null,
    false,
    false,
  );
  // Remove addressLine3 from the ui:order so it doesn't throw an error because it's not in the schema
  addressUI['ui:order'].splice(
    addressUI['ui:order'].indexOf('addressLine3'),
    1,
  );

  return {
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
          address: addressUI,
        },
      },
    },
  };
};

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
