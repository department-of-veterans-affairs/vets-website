import React from 'react';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaCheckboxGroupField from 'platform/forms-system/src/js/web-component-fields/VaCheckboxGroupField';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import {
  PRIVATE_TREATMENT_LOCATION_KEY,
  VA_TREATMENT_LOCATION_KEY,
} from '../../constants';
import { getSelected } from '../../../shared/utils/issues';
import { getAddOrEditMode } from '../../utils/evidence';

const getConditionQuestion = (data, key) =>
  data?.[key]
    ? `What conditions were you treated for at ${data[key]}?`
    : 'What conditions were you treated for?';

const getEditConditionQuestion = (data, key) =>
  data?.[key]
    ? `the conditions you were treated for at ${data[key]}`
    : 'the conditions you were treated for';

export const issuesContent = {
  question: (evidenceType, formData, addOrEdit) => {
    const key =
      evidenceType === 'va'
        ? VA_TREATMENT_LOCATION_KEY
        : PRIVATE_TREATMENT_LOCATION_KEY;

    if (addOrEdit === 'add') {
      return getConditionQuestion(formData, key);
    }

    return getEditConditionQuestion(formData, key);
  },
  label: 'Select all the service-connected conditions you were treated for',
  requiredError: 'Select a condition',
};

// Wrapper component to fix index prop type warning
const VaCheckboxGroupFieldWrapper = props => {
  const index =
    // eslint-disable-next-line react/prop-types
    typeof props.index === 'string' ? parseInt(props.index, 10) : props.index;
  return <VaCheckboxGroupField {...props} index={index} />;
};

// Create base UI with minimal config - labels will be dynamically added
const baseIssuesCheckboxUI = {
  'ui:title': issuesContent.label,
  'ui:webComponentField': VaCheckboxGroupFieldWrapper,
  'ui:errorMessages': {
    atLeastOne: issuesContent.requiredError,
  },
  'ui:required': () => true,
  'ui:validations': [validateBooleanGroup],
};

export const issuesPage = (evidenceType, formKey) => ({
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      issuesContent.question(evidenceType, formData, getAddOrEditMode()),
    ),
    [formKey]: {
      ...baseIssuesCheckboxUI,
      'ui:options': {
        updateSchema: (...args) => {
          // eslint-disable-next-line no-unused-vars
          const [_itemData, schema, _uiSchema, index, _path, fullData] = args;

          const selectedIssues = getSelected(fullData).map(issue => {
            if (issue?.attributes) {
              return issue?.attributes?.ratingIssueSubjectText;
            }
            return issue.issue;
          });

          const properties = {};
          const issueUiSchemas = {};

          selectedIssues.forEach(issue => {
            properties[issue] = {
              type: 'boolean',
              title: issue,
            };
            issueUiSchemas[issue] = {
              'ui:title': issue,
            };
          });

          return {
            type: 'object',
            properties,
            issueUiSchemas,
          };
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [formKey],
    properties: {
      [formKey]: checkboxGroupSchema(['na']),
    },
  },
});
