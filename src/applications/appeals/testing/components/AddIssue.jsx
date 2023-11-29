import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  VaMemorableDate,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { focusElement } from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';

// updatePage isn't available for CustomPage on non-review pages, see
// https://github.com/department-of-veterans-affairs/va.gov-team/issues/33797
import { setData } from 'platform/forms-system/src/js/actions';
import { validateDate } from '../../10182/validations/date';
import { maxNameLength } from '../../10182/validations/issues';
import { content } from '../content/addIssue';

import {
  CONTESTABLE_ISSUES_PATH,
  LAST_ISSUE,
  MAX_LENGTH,
  REVIEW_AND_SUBMIT,
  REVIEW_ISSUES,
  SELECTED,
} from '../../shared/constants';
import { getSelected, calculateIndexOffset } from '../../shared/utils/issues';
import { checkValidations } from '../../shared/validations';
import { uniqueIssue, missingIssueName } from '../../shared/validations/issues';

const ISSUES_PAGE = `/${CONTESTABLE_ISSUES_PATH}`;

const AddIssue = props => {
  const { data, goToPath, setFormData, testingIndex } = props;
  const { contestedIssues = [], additionalIssues = [] } = data || {};

  const allIssues = contestedIssues.concat(additionalIssues);

  // get index from url '/add-issue?index={index}' or testingIndex
  const searchIndex = new URLSearchParams(window.location.search);
  let index = parseInt(searchIndex.get('index') || testingIndex, 10);
  if (Number.isNaN(index) || index < contestedIssues.length) {
    index = allIssues.length;
  }
  const setStorage = (type, value = '') => {
    // set session storage of edited item. This enables focusing on the item
    // upon return to the eligible issues page (a11y); when -1 is set, the add
    // a new issue action link will be focused
    window.sessionStorage.setItem(LAST_ISSUE, value || `${index},${type}`);
    window.sessionStorage.removeItem(REVIEW_ISSUES);
  };
  const offsetIndex = calculateIndexOffset(index, contestedIssues.length);
  const currentData = allIssues[index] || {};

  const addOrEdit = currentData.issue ? 'edit' : 'add';

  const onReviewPage = window.sessionStorage.getItem(REVIEW_ISSUES) === 'true';
  const returnPath = onReviewPage ? REVIEW_AND_SUBMIT : ISSUES_PAGE;

  const nameValidations = [missingIssueName, maxNameLength, uniqueIssue];
  const dateValidations = [validateDate];
  const uniqueValidations = [uniqueIssue];

  const [issueName, setIssueName] = useState(currentData.issue || '');
  const [inputDirty, setInputDirty] = useState(false);

  const [issueDate, setIssueDate] = useState(currentData.decisionDate);
  const [dateDirty, setDateDirty] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  // check name
  const nameErrorMessage = checkValidations(nameValidations, issueName, data);
  // check dates
  const dateErrorMessage = checkValidations(
    dateValidations,
    issueDate || '',
    data,
  );
  // check name & date combo uniqueness
  const uniqueErrorMessage = checkValidations(uniqueValidations, '', {
    contestedIssues,
    additionalIssues: [
      // remove current issue from list - clicking "update issue" won't show
      // unique issue error message
      ...additionalIssues.filter((_, indx) => offsetIndex !== indx),
      { issue: issueName, decisionDate: issueDate },
    ],
  });

  const showIssueNameError = nameErrorMessage[0] || uniqueErrorMessage[0];
  const [invalidDate = '', invalidDateParts = ''] = dateErrorMessage || [];

  const isInvalid = part =>
    invalidDateParts.includes(part) || invalidDateParts.includes('other');

  // submit issue with validation
  const addOrUpdateIssue = () => {
    setSubmitted(true);
    if (!showIssueNameError && !invalidDate) {
      const selectedCount =
        getSelected(data).length + (currentData[SELECTED] ? 0 : 1);

      const issues = [...additionalIssues];
      // index based on combined contestable issues + additional issues
      issues[offsetIndex] = {
        issue: issueName,
        decisionDate: issueDate,
        // select new item, if the max number isn't already selected
        [SELECTED]: selectedCount <= MAX_LENGTH.SELECTIONS,
      };
      setFormData({ ...data, additionalIssues: issues });
      goToPath(returnPath);
    } else if (showIssueNameError) {
      focusElement('input', {}, $('#issue-name')?.shadowRoot);
    } else {
      const date = $('va-memorable-date');
      const monthInput = $('va-text-input.input-month', date?.shadowRoot);
      if (monthInput) {
        focusElement('input', {}, monthInput.shadowRoot);
        $('input', monthInput.shadowRoot)?.select();
      }
    }
  };

  const handlers = {
    onSubmit: event => event.preventDefault(),
    onIssueNameChange: event => {
      setIssueName(event.target.value);
    },
    onInputBlur: () => {
      setInputDirty(true);
    },
    onDateChange: event => {
      setIssueDate(event.target.value);
    },
    onDateBlur: () => {
      // this is currently called for each of the 3 elements
      setDateDirty(true);
    },
    onCancel: event => {
      event.preventDefault();
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'secondary',
        'button-click-label': 'Cancel',
        'button-background-color': 'white',
      });
      setStorage('cancel', addOrEdit === 'add' ? -1 : '');
      goToPath(returnPath);
    },
    onUpdate: event => {
      event.preventDefault();
      recordEvent({
        event: 'cta-button-click',
        'button-type': 'primary',
        'button-click-label': 'Add issue',
        'button-background-color': 'blue',
      });
      setStorage('updated');
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
          <h1 className="vads-u-margin--0">{content.title[addOrEdit]}</h1>
        </legend>
        <p>
          You can find the name of the issue decision date on your decision
          notice now{' '}
          <a href="/track-claims/your-claim-letters" target="_blank">
            available online (opens in new tab)
          </a>
          .
        </p>
        <VaTextInput
          id="issue-name"
          name="issue-name"
          type="text"
          label={content.name.label}
          required
          value={issueName}
          onInput={handlers.onIssueNameChange}
          onBlur={handlers.onInputBlur}
          error={((submitted || inputDirty) && showIssueNameError) || null}
          message-aria-describedby={content.name.hintText}
          uswds
        >
          {content.name.hint}
        </VaTextInput>

        <br role="presentation" />

        <VaMemorableDate
          name="decision-date"
          label={content.date.label}
          // hint={content.date.hint}
          required
          onDateChange={handlers.onDateChange}
          onDateBlur={handlers.onDateBlur}
          value={issueDate}
          error={((submitted || dateDirty) && dateErrorMessage[0]) || null}
          invalidMonth={isInvalid('month')}
          invalidDay={isInvalid('day')}
          invalidYear={isInvalid('year')}
          aria-describedby="decision-date-description"
          uswds
        />
        <p className="vads-u-margin-top--4">
          <va-button
            id="cancel"
            secondary
            class="vads-u-width--auto"
            onClick={handlers.onCancel}
            text={content.button.cancel}
            uswds
          />
          <va-button
            id="submit"
            class="vads-u-width--auto"
            onClick={handlers.onUpdate}
            text={content.button[addOrEdit]}
            uswds
          />
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
