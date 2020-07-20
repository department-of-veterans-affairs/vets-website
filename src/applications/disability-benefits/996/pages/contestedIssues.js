import SelectArrayItemsWidget from '../containers/SelectArrayItemsWidget';

import {
  contestedIssuesTitle,
  disabilityOption,
  disabilitiesExplanation,
  contestedIssuesAlert,
} from '../content/contestedIssues';
import {
  OfficeForReviewTitle,
  OfficeForReviewDescription,
  OfficeForReviewAlert,
} from '../content/OfficeForReview';

import { requireRatedDisability } from '../validations';
import SameOfficeReviewField from '../containers/SameOfficeReviewField';

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
        customTitle: ' ',
      },
      'ui:validations': [requireRatedDisability],
      'ui:required': () => true,
    },
    'view:contestedIssuesAlert': {
      'ui:description': contestedIssuesAlert,
      'ui:options': {
        hideIf: formData =>
          formData.contestedIssues?.some(entry => entry['view:selected']),
      },
    },
    'view:disabilitiesExplanation': {
      'ui:description': disabilitiesExplanation,
    },
    sameOffice: {
      'ui:title': OfficeForReviewTitle,
      // including a description here would add it _above_ the checkbox
      'ui:widget': 'checkbox',
      'ui:reviewField': SameOfficeReviewField,
      'ui:options': {
        hideLabelText: true,
      },
    },
    'view:sameOfficeDescription': {
      'ui:title': '',
      'ui:description': OfficeForReviewDescription,
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
      contestedIssues: {
        type: 'array',
        minItems: 1,
        maxItems: 100,
        items: {
          type: 'object',
          properties: {},
          'view:selected': 'boolean',
        },
      },
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
      'view:sameOfficeDescription': {
        type: 'object',
        properties: {},
      },
      sameOfficeAlert: {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default contestedIssuesPage;
