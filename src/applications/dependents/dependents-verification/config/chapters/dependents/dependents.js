import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  DependentsInformation,
  DependentsInformationReview,
} from '../../../components/DependentsInformation';

export const dependents = {
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'object',
        properties: {},
      },
      hasDependentsStatusChanged: radioSchema(['Y', 'N']),
    },
  },
  uiSchema: {
    dependents: {
      'ui:description': DependentsInformation,
      'ui:reviewField': DependentsInformationReview,
    },
    hasDependentsStatusChanged: radioUI({
      title: 'Has the status of your dependents changed?',
      labels: {
        Y: 'Yes',
        N: 'No',
      },
      descriptions: {
        Y: 'Update the status of my dependents',
        N: 'I’ve reviewed and certified my dependents are correctly listed',
      },
      labelHeaderLevel: '3',
      tile: true,
    }),
  },
};
