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

const fakeJSON = [
  {
    id: 1,
    state: 'Michigan',
    name: 'My VA Location',
  },
];

const executed = false;

export const uiSchema = {
  vaLocation: {
    location: {
      'ui:widget': LocationFinder,
    },
  },
};
