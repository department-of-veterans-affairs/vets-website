import fullSchema from '../20-0996-schema.json';
import SelectArrayItemsWidget from '../../all-claims/components/SelectArrayItemsWidget';

import {
  contestedIssuesTitle,
  contestedIssuesDescription,
  disabilityOption,
  disabilitiesExplanation,
  contestedIssuesAlert,
} from '../content/contestedIssues';

import { requireRatedDisability } from '../validations';

const { contestedIssues } = fullSchema.properties.veteran.properties;

const contestedIssuesPage = {
  uiSchema: {
    veteran: {
      'ui:title': contestedIssuesTitle,
      title: {
        className: 'contested-issues-wrap',
      },
      contestedIssues: {
        'ui:title': ' ',
        'ui:description': contestedIssuesDescription,
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
            const hasSelection = formData.veteran.contestedIssues?.some(
              entry => entry['view:selected'],
            );
            return hasSelection;
          },
        },
      },
      'view:disabilitiesExplanation': {
        'ui:description': disabilitiesExplanation,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      veteran: {
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
        },
      },
    },
  },
};

export default contestedIssuesPage;
