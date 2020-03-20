import fullSchema from '../20-0996-schema.json';
import SelectArrayItemsWidget from '../containers/SelectArrayItemsWidget';

import {
  contestedIssuesTitle,
  disabilityOption,
  disabilitiesExplanation,
  contestedIssuesAlert,
} from '../content/contestedIssues';
import {
  OfficeForReviewTitle,
  OfficeForReviewAlert,
} from '../content/officeForReview';

import { requireRatedDisability } from '../validations';

const { contestedIssues } = fullSchema.properties;

const contestedIssuesPage = {
  uiSchema: {
    'ui:title': contestedIssuesTitle,
    contestedIssues: {
      'ui:title': ' ',
      'ui:field': 'StringField',
      'ui:widget': SelectArrayItemsWidget,
      'ui:options': {
        showFieldLabel: 'label',
        label: disabilityOption,
        widgetClassNames: 'widget-outline',
        keepInPageOnReview: true,
      },
      'ui:validations': [requireRatedDisability],
      'ui:required': () => true,
    },
    'view:contestedIssuesAlert': {
      'ui:description': contestedIssuesAlert,
      'ui:options': {
        hideIf: formData => {
          const hasSelection = formData.contestedIssues?.some(
            entry => entry['view:selected'],
          );
          return hasSelection;
        },
      },
    },
    'view:disabilitiesExplanation': {
      'ui:description': disabilitiesExplanation,
    },
    sameOffice: {
      'ui:title': OfficeForReviewTitle,
      'ui:widget': 'checkbox',
      'ui:options': {
        hideLabelText: true,
      },
    },
    sameOfficeAlert: {
      'ui:title': OfficeForReviewAlert,
      'ui:options': {
        hideIf: formData => formData?.sameOffice !== true,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      contestedIssues,
      'view:contestedIssuesAlert': {
        type: 'object',
        properties: {},
      },
      'view:disabilitiesExplanation': {
        type: 'object',
        properties: {},
      },
      sameOffice: {
        type: 'boolean',
      },
      sameOfficeAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contestedIssuesPage;
