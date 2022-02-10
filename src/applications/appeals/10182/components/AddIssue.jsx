import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { VaTextInput } from '@department-of-veterans-affairs/web-components/react-bindings';
// using React component because the WC doesn't allow JSX in the label
import TextInput from '@department-of-veterans-affairs/component-library/TextInput';
import { SimpleDate } from '@department-of-veterans-affairs/component-library/Date';

// updatePage isn't available for CustomPage on non-review pages, see
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/33797
import { setData } from 'platform/forms-system/src/js/actions';
import { isDirtyDate } from 'platform/forms/validations';

import { getSelected, calculateIndexOffset } from '../utils/helpers';
import { SELECTED, MAX_SELECTIONS, LAST_NOD_ITEM } from '../constants';

import { validateDate } from '../validations/date';
import {
  uniqueIssue,
  missingIssueName,
  maxNameLength,
  checkValidations,
} from '../validations/issues';
import {
  addIssueTitle,
  issueNameLabel,
  dateOfDecisionLabel,
} from '../content/addIssue';
import { getIsoDateFromSimpleDate, getSimpleDateFromIso } from '../utils/dates';

const ISSUES_PAGE = '/contestable-issues';
const REVIEW_AND_SUBMIT = '/review-and-submit';

const AddIssue = props => {
  const { data, goToPath, onReviewPage, setFormData, testingIndex } = props;
  const { contestableIssues = [], additionalIssues = [] } = data || {};

  const allIssues = contestableIssues.concat(additionalIssues);

  // get index from url '/add-issue?index={index}' or testingIndex
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index') || testingIndex, 10);
  if (Number.isNaN(index) || index < contestableIssues.length) {
    index = allIssues.length;
  }
  const offsetIndex = calculateIndexOffset(index, contestableIssues.length);
  const currentData = allIssues[index] || {};

  // set session storage of edited item. This enables focusing on the item
  // upon return to the eligible issues page (a11y)
  window.sessionStorage.setItem(LAST_NOD_ITEM, index);

  const returnPath = onReviewPage ? REVIEW_AND_SUBMIT : ISSUES_PAGE;

  const nameValidations = [missingIssueName, maxNameLength, uniqueIssue];
  const dateValidations = [validateDate];
  const uniqueValidations = [uniqueIssue];

  const [fieldObj, setFieldObj] = useState({
    value: currentData.issue || '',
    dirty: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const [date, setDate] = useState(
    getSimpleDateFromIso(currentData.decisionDate),
  );

  // check name
  const nameErrorMessage = checkValidations(
    nameValidations,
    fieldObj.value,
    data,
  );
  // check dates
  const dateErrorMessage = checkValidations(
    dateValidations,
    getIsoDateFromSimpleDate(date),
    data,
  );
  // check name & date combo uniqueness
  const uniqueErrorMessage = checkValidations(uniqueValidations, '', {
    contestableIssues,
    additionalIssues: [
      // remove current issue from list - clicking "update issue" won't show
      // unique issue error message
      ...additionalIssues.filter((_, indx) => offsetIndex !== indx),
      { issue: fieldObj.value, decisionDate: getIsoDateFromSimpleDate(date) },
    ],
  });
  const showError = nameErrorMessage[0] || uniqueErrorMessage[0];

  // submit issue with validation
  const addOrUpdateIssue = () => {
    setSubmitted(true);
    if (!showError && dateErrorMessage.length === 0) {
      const selectedCount =
        getSelected(data).length + (currentData[SELECTED] ? 0 : 1);

      const issues = [...additionalIssues];
      // index based on combined contestable issues + additional issues
      issues[offsetIndex] = {
        issue: fieldObj.value,
        decisionDate: getIsoDateFromSimpleDate(date),
        // select new item, if the max number isn't already selected
        [SELECTED]: selectedCount <= MAX_SELECTIONS,
      };
      setFormData({ ...data, additionalIssues: issues });
      goToPath(returnPath);
    }
  };

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onIssueNameChange: updatedField => {
      setFieldObj(updatedField);
    },
    onCancel: event => {
      event.preventDefault();
      goToPath(returnPath);
    },
    onUpdate: event => {
      event.preventDefault();
      addOrUpdateIssue();
    },
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset>
        <legend
          id="decision-date-description"
          className="vads-u-font-family--serif"
          name="addIssue"
        >
          {addIssueTitle}
        </legend>
        <TextInput
          id="add-nod-issue"
          name="add-nod-issue"
          type="text"
          label={issueNameLabel}
          required
          field={fieldObj}
          onValueChange={handlers.onIssueNameChange}
          errorMessage={
            (submitted || fieldObj.dirty) && showError ? showError : null
          }
        />
        <br />
        <SimpleDate
          name="decision-date"
          label={dateOfDecisionLabel}
          required
          onValueChange={setDate}
          date={date}
          errorMessage={(submitted || isDirtyDate(date)) && dateErrorMessage[0]}
          ariaDescribedby="decision-date-description"
        />
        <p>
          <button
            type="button"
            id="cancel"
            className="usa-button-secondary vads-u-width--auto"
            onClick={handlers.onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            id="submit"
            className="vads-u-width--auto"
            onClick={handlers.onUpdate}
          >
            {`${currentData.issue ? 'Update' : 'Add'} issue`}
          </button>
        </p>
      </fieldset>
    </form>
  );
};

AddIssue.propTypes = {
  data: PropTypes.shape({}),
  goToPath: PropTypes.func,
  setFormData: PropTypes.func,
  testingIndex: PropTypes.number,
  onReviewPage: PropTypes.bool,
};

const mapDispatchToProps = {
  setFormData: setData,
};

export default connect(
  null,
  mapDispatchToProps,
)(AddIssue);

export { AddIssue };
