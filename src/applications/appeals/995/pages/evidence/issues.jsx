import React from 'react';
import PropTypes from 'prop-types';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { getSelected } from '../../../shared/utils/issues';
import { issuesContent } from '../../content/evidence/va';

/**
 * This function creates a checkbox schema/uiSchema that includes
 * dynamic checkbox labels/values based on the contestedIssues and
 * additional issues array available in the form data.
 * @param {Object} data Full form data
 * @returns Object containing a checkboxgroup uiSchema and schema
 */
const dynamicSchema = data => {
  const selectedIssues = getSelected(data).map(issue => {
    if (issue?.attributes) {
      return issue?.attributes?.ratingIssueSubjectText;
    }

    return issue.issue;
  });

  return {
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
        labels: selectedIssues,
      }),
    },
    schema: {
      type: 'object',
      required: ['issues'],
      properties: {
        // issues: checkboxGroupSchema(Object.values(selectedIssues)),
        issues: checkboxGroupSchema(Object.keys(selectedIssues)),
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
  const sch = dynamicSchema(fullData);

  const handleChange = changeProps => {
    console.log('changeProps: ', changeProps);
    onChange();
  };

  console.log('onChange: ', onChange);

  return (
    <SchemaForm
      data={data}
      name={name}
      onChange={handleChange}
      onSubmit={onSubmit}
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
        <FormNavButtons goBack={goBack} useWebComponents />
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
  goToPath: PropTypes.func,
  name: PropTypes.string,
  pagePerItemIndex: PropTypes.string,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Issues;
