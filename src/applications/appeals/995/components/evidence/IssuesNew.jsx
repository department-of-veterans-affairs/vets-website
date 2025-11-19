import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { focusElement } from 'platform/utilities/ui';
import { getSelected } from '../../../shared/utils/issues';
import { issuesContent } from '../../content/evidence/va';

// This is the original schema that will be dynamically overruled as soon
// as the user lands on this page. We need this since we won't have the
// issues array at initial form load.
/** @returns {PageSchema} */
export const issuesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.name
          ? `What conditions were you treated for at ${formData.name}?`
          : 'What conditions were you treated for?',
    ),
    issues: checkboxGroupUI({
      title: issuesContent.label,
      required: true,
      labels: { NA: 'NA' },
      errorMessages: {
        required: issuesContent.requiredError,
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['issues'],
    properties: {
      issues: checkboxGroupSchema(['na']),
    },
  },
};

/**
 * This function creates a checkbox schema/uiSchema that includes
 * dynamic checkbox labels/values based on the contestedIssues and
 * additional issues array available in the form data.
 * @param {Array} selectedIssues - Array of issue names
 * @param {boolean} showError - Whether to show validation error
 * @returns Object containing a checkboxgroup uiSchema and schema
 */
const dynamicSchema = (selectedIssues, showError = false) => {
  const labels = {};

  for (const issue of selectedIssues) {
    labels[issue] = issue;
  }

  const issuesUI = checkboxGroupUI({
    title: issuesContent.label,
    required: true,
    labels,
    errorMessages: {
      required: issuesContent.requiredError,
    },
  });

  // Add custom validation that triggers on form submission
  if (showError) {
    issuesUI['ui:validations'] = [
      (errors, fieldData) => {
        // Check if any checkboxes are selected
        const hasSelection =
          fieldData && Object.values(fieldData).some(val => val === true);

        if (!hasSelection) {
          errors.addError(issuesContent.requiredError);
        }
      },
    ];
  }

  return {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          formData?.name
            ? `What conditions were you treated for at ${formData.name}?`
            : 'What conditions were you treated for?',
      ),
      issues: issuesUI,
    },
    schema: {
      type: 'object',
      required: ['issues'],
      properties: {
        issues: checkboxGroupSchema(Object.values(selectedIssues)),
      },
    },
  };
};

/** @type {CustomPageType} */
const Issues = props => {
  const {
    arrayBuilder,
    contentAfterButtons,
    contentBeforeButtons,
    data,
    fullData,
    goBack,
    goToPath,
    name,
    onChange,
    onSubmit,
    pagePerItemIndex,
    title,
    trackingPrefix,
  } = props;
  const {
    arrayPath,
    getIntroPath,
    getSummaryPath,
    getText,
    required,
    reviewRoute,
  } = arrayBuilder;

  const [submitted, setSubmitted] = useState(false);

  const selectedIssues = Object.freeze(
    getSelected(fullData).map(issue => {
      if (issue?.attributes) {
        return issue?.attributes?.ratingIssueSubjectText;
      }

      return issue.issue;
    }),
  );

  const getCheckedIssues = issues => {
    if (!issues) {
      return null;
    }

    return Object.keys(issues).filter(key => issues[key] === true);
  };

  const handleSubmit = () => {
    setSubmitted(true);

    const previouslySelectedIssues = data?.issues || null;
    const issuesToStore = getCheckedIssues(previouslySelectedIssues);

    if (!issuesToStore?.length) {
      // Focus the error for accessibility
      setTimeout(() => {
        const errorElement = document.querySelector('[error]');

        if (errorElement) {
          focusElement(errorElement);
        }
      }, 100);
      return;
    }

    const transformedData = {
      ...data,
      issues: issuesToStore,
    };

    onSubmit({ formData: transformedData });
  };

  const handleChange = formData => {
    // Clear submitted flag when user makes changes
    if (submitted) {
      setSubmitted(false);
    }

    onChange(formData);
  };

  const sch = dynamicSchema(selectedIssues, submitted);

  return (
    <SchemaForm
      data={data}
      name={name}
      onChange={handleChange}
      pagePerItemIndex={pagePerItemIndex}
      schema={sch.schema}
      title={title}
      trackingPrefix={trackingPrefix}
      uiSchema={sch.uiSchema}
    >
      <>
        <ArrayBuilderCancelButton
          goToPath={goToPath}
          arrayPath={arrayPath}
          summaryRoute={getSummaryPath()}
          introRoute={getIntroPath()}
          reviewRoute={reviewRoute}
          getText={getText}
          required={required}
        />
        {contentBeforeButtons}
        <FormNavButtons
          goBack={goBack}
          goForward={handleSubmit}
          useWebComponents
        />
        {contentAfterButtons}
      </>
    </SchemaForm>
  );
};

Issues.propTypes = {
  arrayBuilder: PropTypes.shape({
    arrayPath: PropTypes.string,
    getIntroPath: PropTypes.func,
    getSummaryPath: PropTypes.func,
    getText: PropTypes.func,
    required: PropTypes.func,
    reviewRoute: PropTypes.string,
  }),
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
  data: PropTypes.shape(),
  fullData: PropTypes.shape(),
  goBack: PropTypes.func,
  goForward: PropTypes.func,
  goToPath: PropTypes.func,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  pagePerItemIndex: PropTypes.string,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
};

export default Issues;
