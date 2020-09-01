import ClaimantInformationComponent from './staticClaimantComponent.jsx';

export const schema = {
  type: 'object',
  properties: {},
};

export const uiSchema = {
  'ui:description': ClaimantInformationComponent,
  'ui:options': {
    hideOnReview: true,
  },
};
