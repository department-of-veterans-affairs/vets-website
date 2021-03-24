import { LocationFinder } from './location-finder';

export const schema = {
  vaLocation: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
      },
    },
  },
};

export const uiSchema = {
  vaLocation: {
    location: {
      'ui:widget': LocationFinder,
      'ui:options': {
        hideLabelText: true,
      },
    },
  },
};
