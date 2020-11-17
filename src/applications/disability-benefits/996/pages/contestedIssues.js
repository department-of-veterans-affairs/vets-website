import SelectArrayItemsWidget from '../containers/SelectArrayItemsWidget';

import {
  ContestedIssuesTitle,
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
import { SELECTED } from '../constants';

const hasNoContestedIssues = formData => !formData.contestedIssues?.length;

const contestedIssuesPage = {
  uiSchema: {
    'ui:title': ContestedIssuesTitle,
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
          formData.contestedIssues?.some(entry => entry[SELECTED]) ||
          hasNoContestedIssues(formData),
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
        hideIf: hasNoContestedIssues,
      },
    },
    'view:sameOfficeDescription': {
      'ui:title': '',
      'ui:description': OfficeForReviewDescription,
      'ui:options': {
        hideIf: hasNoContestedIssues,
      },
    },
    sameOfficeAlert: {
      'ui:title': OfficeForReviewAlert,
      'ui:options': {
        hideIf: formData =>
          formData?.sameOffice !== true || hasNoContestedIssues(formData),
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
          [SELECTED]: 'boolean',
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
