import VeteranInformationComponent from './staticVeteranComponent.jsx';

export const schema = {
  type: 'object',
  properties: {},
};

export const uiSchema = {
  'ui:description': VeteranInformationComponent,
  'ui:options': {
    hideOnReview: true,
  },
};
