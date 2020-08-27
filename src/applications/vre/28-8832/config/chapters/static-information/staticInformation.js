import staticInformationComponent from './staticInformationComponent.jsx';

export const schema = {
  type: 'object',
  properties: {},
};

export const uiSchema = {
  'ui:description': staticInformationComponent,
  'ui:options': {
    hideOnReview: true,
  },
};
