import InitialConfirmEligibilityView from '../containers/InitialConfirmEligibilityView';

export const uiSchema = {
  'view:initialConfirmEligibility': {
    'ui:field': InitialConfirmEligibilityView,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:initialConfirmEligibility': {
      type: 'object',
      properties: {},
    },
  },
};
