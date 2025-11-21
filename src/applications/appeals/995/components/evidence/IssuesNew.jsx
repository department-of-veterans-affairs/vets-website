import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { getSelected } from '../../../shared/utils/issues';
import { issuesContent } from '../../content/evidence/va';
import { VA_TREATMENT_LOCATION_KEY } from '../../constants';

// This is the original schema that will be dynamically overruled as soon
// as the user lands on this page. We need this since we won't have the
// issues array at initial form load.
/** @returns {PageSchema} */
export const issuesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) =>
        formData?.[VA_TREATMENT_LOCATION_KEY]
          ? `What conditions were you treated for at ${
              formData[VA_TREATMENT_LOCATION_KEY]
            }?`
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
 * @param {Object} data Full form data
 * @returns Object containing a checkboxgroup uiSchema and schema
 */
const dynamicSchema = selectedIssues => {
  const labels = {};

  for (const issue of selectedIssues) {
    labels[issue] = issue;
  }

  return {
    uiSchema: {
      ...arrayBuilderItemSubsequentPageTitleUI(
        ({ formData }) =>
          formData?.[VA_TREATMENT_LOCATION_KEY]
            ? `What conditions were you treated for at ${
                formData[VA_TREATMENT_LOCATION_KEY]
              }?`
            : 'What conditions were you treated for?',
      ),
      issues: checkboxGroupUI({
        title: issuesContent.label,
        required: true,
        labels,
        errorMessages: {
          required: issuesContent.requiredError,
        },
      }),
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
  const [error, setError] = useState(false);

  const formLabel = data?.[VA_TREATMENT_LOCATION_KEY]
    ? `What conditions were you treated for at ${
        data[VA_TREATMENT_LOCATION_KEY]
      }?`
    : 'What conditions were you treated for?';

  const selectedIssues = Object.freeze(
    getSelected(fullData).map(issue => {
      if (issue?.attributes) {
        return issue?.attributes?.ratingIssueSubjectText;
      }

      return issue.issue;
    }),
  );

  // const sch = dynamicSchema(selectedIssues);

  const getCheckedIssues = issues => {
    if (!issues) {
      return null;
    }

    return Object?.keys(issues)?.filter(key => issues[key] === true);
  };

  /**
   * Convert the issues object (like the below) into an issues array:
   *
   * {
   *   Hypertension: true,
   *   Sleep apnea: true
   * }
   *
   * becomes
   *
   * [ 'Hypertension', 'Sleep apnea' ]
   */
  const handleSubmit = () => {
    const previouslySelectedIssues = data?.issues || null;
    const issuesToStore = getCheckedIssues(previouslySelectedIssues);

    if (!issuesToStore?.length) {
      setError(true);
      return;
    }

    const transformedData = {
      ...data,
      issues: issuesToStore,
    };

    onSubmit({ formData: transformedData });
  };

  const handleChange = e => {
    console.log('e: ', e);
    console.log('index: ', e.target.dataset.index);
    const checkedIssues = getCheckedIssues(e?.issues);

    if (!checkedIssues?.length) {
      setError(true);
    }

    if (error && checkedIssues?.length) {
      setError(false);
    }

    onChange(e);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VaCheckboxGroup
        form-heading={formLabel}
        form-heading-level={3}
        name={name}
        onVaChange={handleChange}
        error={error ? issuesContent.requiredError : null}
        required
        use-forms-pattern="single"
      >
        {selectedIssues.map((issue, index) => (
          <va-checkbox
            key={index}
            label={issue}
            checked={data?.issues?.includes(issue)}
          />
        ))}
        <div slot="form-description">
          <p className="vads-u-margin-bottom--0">
            Select all the service-connected conditions you were treated for
          </p>
        </div>
      </VaCheckboxGroup>
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
    </form>
  );

  // return (
  //   <SchemaForm
  //     data={data}
  //     error="This is an error"
  //     name={name}
  //     onChange={onChange}
  //     pagePerItemIndex={pagePerItemIndex}
  //     schema={sch.schema}
  //     title={title}
  //     trackingPrefix={trackingPrefix}
  //     uiSchema={sch.uiSchema}
  //   >
  //     <>
  //       <ArrayBuilderCancelButton
  //         goToPath={goToPath}
  //         arrayPath={arrayPath}
  //         summaryRoute={getSummaryPath()}
  //         introRoute={getIntroPath()}
  //         reviewRoute={reviewRoute}
  //         getText={getText}
  //         required={required}
  //       />
  //       {contentBeforeButtons}
  //       <FormNavButtons
  //         goBack={goBack}
  //         goForward={handleSubmit}
  //         useWebComponents
  //       />
  //       {contentAfterButtons}
  //     </>
  //   </SchemaForm>
  // );
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
  pagePerItemIndex: PropTypes.string,
  setFormData: PropTypes.func,
  title: PropTypes.string,
  trackingPrefix: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Issues;
