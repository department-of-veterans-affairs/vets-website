import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  arrayBuilderItemSubsequentPageTitleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaCheckboxGroup } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import ArrayBuilderCancelButton from 'platform/forms-system/src/js/patterns/array-builder/ArrayBuilderCancelButton';
import { getSelected } from '../../../shared/utils/issues';
import { issuesContent } from '../../content/evidence/va';
import { VA_TREATMENT_LOCATION_KEY } from '../../constants';

const getConditionQuestion = data =>
  data?.[VA_TREATMENT_LOCATION_KEY]
    ? `What conditions were you treated for at ${
        data[VA_TREATMENT_LOCATION_KEY]
      }?`
    : 'What conditions were you treated for?';

// This is the original schema that will be dynamically overruled as soon
// as the user lands on this page. We need this since we won't have the
// issues array at initial form load.
/** @returns {PageSchema} */
export const issuesPage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(({ formData }) =>
      getConditionQuestion(formData),
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
  const currentEvidenceData = fullData?.vaEvidence?.[pagePerItemIndex] || {};
  const formLabel = getConditionQuestion(data);

  const selectedIssues = Object.freeze(
    getSelected(fullData).map(issue => {
      if (issue?.attributes) {
        return issue?.attributes?.ratingIssueSubjectText;
      }

      return issue.issue;
    }),
  );

  const handleSubmit = () => {
    if (!currentEvidenceData?.issues?.length) {
      setError(true);
      return;
    }

    setError(false);
    onSubmit({ formData: currentEvidenceData });
  };

  const handleChange = event => {
    const checkedIssue = event?.target?.label || '';

    if (!checkedIssue) {
      return;
    }

    const issueWasAlreadyChecked = currentEvidenceData?.issues?.includes(
      checkedIssue,
    );

    const newData = { ...currentEvidenceData };

    // Create new issues array based on the user interaction
    if (issueWasAlreadyChecked) {
      newData.issues = newData.issues.filter(issue => issue !== checkedIssue);
    } else {
      newData.issues = [...(newData?.issues || []), checkedIssue];
    }

    if (!newData?.issues || !newData?.issues.length) {
      setError(true);
    } else {
      setError(false);
    }

    // Pass the new evidence data (location name and issues)
    // back to array builder to update
    onChange(newData);
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
        {selectedIssues.map((issue, index) => {
          const isChecked = currentEvidenceData.issues?.includes(issue);

          return <va-checkbox key={index} label={issue} checked={isChecked} />;
        })}
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
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default Issues;
