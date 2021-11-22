import serviceBefore1977UI from '../../definitions/serviceBefore1977';
import fullSchema1995 from 'vets-json-schema/dist/22-1995-schema.json';

const { serviceBefore1977 } = fullSchema1995.definitions;

export const uiSchema = {
  serviceBefore1977: serviceBefore1977UI,
};

export const schema = {
  type: 'object',
  properties: {
    serviceBefore1977,
  },
};
