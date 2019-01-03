import { merge } from 'lodash';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import AuthorityField from '../components/AuthorityField';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import { PtsdAssaultAuthoritiesDescription } from '../content/ptsdAssaultAuthorities';
import { uiSchema as addressUI } from '../../../../platform/forms/definitions/address';
import { validateZIP } from '../validations';

const { sources } = fullSchema.definitions.secondaryPtsdIncident.properties;

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
        address: merge(addressUI(''), {
          'ui:order': [
            'country',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'zipCode',
          ],
          addressLine1: {
            'ui:title': 'Street',
          },
          addressLine2: {
            'ui:title': 'Street 2',
          },
          zipCode: {
            'ui:title': 'Postal Code',
            'ui:validations': [validateZIP],
          },
        }),
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
