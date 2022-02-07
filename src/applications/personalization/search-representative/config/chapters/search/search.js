import SearchRepresentativeWidget from './searchRepresentativeWidget';
import RepresentativeReviewField from './RepresentativeReviewField';

export const schema = {
  type: 'object',
  properties: {
    preferredRepresentative: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        type: {
          type: 'string',
        },
        address: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        state: {
          type: 'string',
        },
        postalCode: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
      },
    },
  },
};

export const uiSchema = {
  'ui:objectViewField': RepresentativeReviewField,
  preferredRepresentative: {
    'ui:title': 'Selected VA medical center',
    'ui:field': SearchRepresentativeWidget,
    'ui:options': {
      hideLabelText: true,
    },
    properties: {
      name: {
        'ui:title': 'Name',
      },
      type: {
        'ui:title': 'Type',
      },
      address: {
        'ui:title': 'Address',
      },
      city: {
        'ui:title': 'City',
      },
      state: {
        'ui:title': 'State',
      },
      postalCode: {
        'ui:title': 'Postal code',
      },
      phone: {
        'ui:title': 'Phone',
      },
    },
  },
};
