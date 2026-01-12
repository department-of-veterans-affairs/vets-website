import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement } from 'platform/utilities/ui/focus';
import { scrollTo } from 'platform/utilities/scroll';
import ActionLink from './web-component-wrappers/ActionLink';
import {
  LAST_ISSUE,
  MAX_LENGTH,
  REVIEW_ISSUES,
  SELECTED,
  FORMAT_YMD_DATE_FNS,
} from '../constants';
import { FETCH_CONTESTABLE_ISSUES_FAILED } from '../actions';
import { IssueCard } from './IssueCard';
import { removeModalContent } from '../content/contestableIssues';
import { getBlockedMessage } from '../utils/contestableIssueMessages';
import { ContestableIssuesLegend } from './ContestableIssuesLegend';
import { MaxSelectionsAlert } from './MaxSelectionsAlert';
import { NoneSelectedAlert } from './NoneSelectedAlert';
import { MessageAlert } from './MessageAlert';
import { focusIssue } from '../utils/focus';
import {
  calculateIndexOffset,
  getSelected,
  someSelected,
} from '../utils/issues';
import { isEmptyObject } from '../utils/helpers';
import { isTodayOrInFuture } from '../validations/date';
import { parseDateToDateObj } from '../utils/dates';

/**
 * ContestableIssues - Form system parameters passed into this widget
 * @param {Boolean} autofocus - should auto focus
 * @param {Boolean} disabled -  is disabled?
 * @param {Object} formContext -  state
 * @param {Object} formData - All form data
 * @param {String} id - ID base for form elements
 * @param {String} label - label text
 * @param {func} onBlur - blur callback
 * @param {Object} options - ui:options
 * @param {String} placeholder - placeholder text
 * @param {Boolean} readonly - readonly state
 * @param {Object} registry - contains definitions, fields, widgets & templates
 * @param {Boolean} required - Show required flag
 * @param {Object} schema - array schema
 * @return {JSX}
 */
const ContestableIssues = props => {
  const {
    id,
    options,
    formContext = {},
    setFormData,
    formData,
    apiLoadStatus,
  } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [editState] = useState(window.sessionStorage.getItem(LAST_ISSUE));

  useEffect(
    () => {
      if (editState) {
        focusIssue();
      }
    },
    [editState],
  );

  const onReviewPage = formContext?.onReviewPage || false;
  window.sessionStorage.setItem(REVIEW_ISSUES, onReviewPage);

  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const inReviewMode = (onReviewPage && formContext.reviewMode) || false;
  const { submitted } = formContext;
  const loadedIssues = useMemo(() => formData.contestedIssues || [], [
    formData.contestedIssues,
  ]);

  // Evaluate issues for same-day decision date blocking (computed at render time)
  const issuesWithDateEvaluation = useMemo(
    () =>
      loadedIssues.map(issue => {
        const approxDecisionDate = issue?.attributes?.approxDecisionDate;
        const decisionDate = parseDateToDateObj(
          approxDecisionDate,
          FORMAT_YMD_DATE_FNS,
        );
        let blockingType = null;

        const blockingCriteria = isTodayOrInFuture(decisionDate);
        const isBlocked = Object?.values(blockingCriteria).some(value => value);

        if (isBlocked) {
          blockingType =
            blockingCriteria.isTodayLocal || blockingCriteria.isFutureLocal
              ? 'local'
              : 'utc';
        }

        return {
          ...issue?.attributes,
          [SELECTED]: issue?.[SELECTED],
          isBlockedSameDay: isBlocked,
          blockingType,
        };
      }),
    [loadedIssues],
  );

  const items = issuesWithDateEvaluation.concat(
    formData.additionalIssues || [],
  );

  const hasIssues = items.length > 0;
  const hasSelected = hasIssues && someSelected(items);
  const showAlert = !hasIssues && !hasSelected && !submitted && !onReviewPage;
  const showApiFailure =
    showAlert && apiLoadStatus === FETCH_CONTESTABLE_ISSUES_FAILED;
  const showNoneSelected =
    // showAlert && !showApiFailure && !hasSelected && !hasIssues;
    showAlert && !showApiFailure && loadedIssues.length === 0;
  const showEditModeError =
    !showNoneSelected && !hasSelected && (onReviewPage || submitted);

  useEffect(
    () => {
      if (showEditModeError) {
        focusElement(`va-alert[status="error"] h${onReviewPage ? 4 : 3}`);
        scrollTo('va-alert[status="error"]');
      }
    },
    [onReviewPage, showEditModeError, submitted],
  );

  if (onReviewPage && inReviewMode && hasIssues && !hasSelected) {
    return (
      <NoneSelectedAlert
        count={items.length}
        headerLevel={5}
        inReviewMode={inReviewMode}
      />
    );
  }

  const handlers = {
    closeModal: () => setShowErrorModal(false),
    onChange: (index, event) => {
      let { checked } = event.target;
      if (checked && getSelected(formData).length + 1 > MAX_LENGTH.SELECTIONS) {
        setShowErrorModal(true);
        event.preventDefault(); // prevent checking
        checked = false;
      } else if (index < loadedIssues.length) {
        // contestable issue check toggle
        const changedItems = set(
          ['contestedIssues', index, SELECTED],
          checked,
          formData,
        );
        // only changes value (equal to formData.contestedIssues)
        setFormData(changedItems);
      } else {
        // additional issue check toggle
        const adjustedIndex = calculateIndexOffset(index, loadedIssues.length);
        const updatedAdditionalIssues = formData.additionalIssues.map(
          (issue, indx) =>
            adjustedIndex === indx ? { ...issue, [SELECTED]: checked } : issue,
        );
        setFormData({
          ...formData,
          additionalIssues: updatedAdditionalIssues,
        });
      }
    },
    onShowRemoveModal: cardIndex => {
      const adjustedIndex = calculateIndexOffset(
        cardIndex,
        loadedIssues.length,
      );
      setRemoveIndex(adjustedIndex);
      setShowRemoveModal(true);
    },
    onRemoveModalClose: () => {
      focusIssue(
        null,
        null,
        `${loadedIssues.length + removeIndex},remove-cancel`,
      );
      setShowRemoveModal(false);
      setRemoveIndex(null);
    },
    onRemoveIssue: () => {
      const updatedAdditionalIssues = formData.additionalIssues.filter(
        (issue, indx) => removeIndex !== indx,
      );
      setShowRemoveModal(false);
      setRemoveIndex(null);
      // setTimeout needed to allow rerender
      setTimeout(() => {
        focusIssue(null, null, -1);
      });

      setFormData({
        ...formData,
        additionalIssues: updatedAdditionalIssues,
      });
    },
  };

  const blockedIssues = items.filter(item => item.isBlockedSameDay);

  const blockedMessage = getBlockedMessage(blockedIssues);

  // Use wrapper div with conditional classes to fix va-alert inconsistent CSS rendering
  const alertClasses =
    blockedIssues?.length > 0
      ? 'vads-u-margin-top--3 vads-u-margin-bottom--2'
      : 'vads-u-margin-top--0p5';

  const issueCards = items.map((item, index) => {
    const itemIsSelected = !!item?.[SELECTED];
    const hideCard = (inReviewMode && !itemIsSelected) || isEmptyObject(item);
    // If the previous issue was blocked and the current one is not, `showSeparator` is true
    const showSeparator =
      index > 0 && !item.isBlockedSameDay && items[index - 1]?.isBlockedSameDay;

    const showCheckbox =
      !item?.isBlockedSameDay &&
      (!onReviewPage || (onReviewPage && !inReviewMode));

    const cardProps = {
      id,
      index,
      item,
      key: index,
      options,
      showCheckbox,
      showSeparator,
      // props.testChange for testing
      onChange: props.testChange || handlers.onChange,
      onRemove: handlers.onShowRemoveModal,
    };

    // Don't show un-selected ratings in review mode
    return hideCard ? null : <IssueCard {...cardProps} />;
  });

  return (
    <>
      <div name="eligibleScrollElement" />
      {showApiFailure && (
        <MessageAlert
          title="We can’t load your issues right now"
          message={`You can come back later, or if you’d like to add your issue manually, you can select "Add a new issue" to get started.`}
          errorKey="api_load_error"
          errorReason="API load error"
        />
      )}
      {showNoneSelected && (
        <MessageAlert
          title="Sorry, we couldn’t find any eligible issues"
          message={`If you’d like to add your issue for review, select "Add a new issue" to get started.`}
          errorKey="no_eligible_issues_loaded"
          errorReason="No eligible issues loaded"
        />
      )}
      {showEditModeError && (
        <NoneSelectedAlert
          count={formData.contestedIssues?.length || 0}
          headerLevel={onReviewPage ? 4 : 3}
          inReviewMode={inReviewMode}
        />
      )}
      <fieldset className="review-fieldset">
        <ContestableIssuesLegend
          onReviewPage={onReviewPage}
          inReviewMode={inReviewMode}
        />
        <VaModal
          clickToClose
          status="warning"
          modalTitle={removeModalContent.title}
          primaryButtonText={removeModalContent.yesButton}
          secondaryButtonText={removeModalContent.noButton}
          onCloseEvent={handlers.onRemoveModalClose}
          onPrimaryButtonClick={handlers.onRemoveIssue}
          onSecondaryButtonClick={handlers.onRemoveModalClose}
          visible={showRemoveModal}
        >
          <p>
            {removeIndex !== null
              ? removeModalContent.description(
                  formData.additionalIssues[removeIndex].issue,
                )
              : null}
          </p>
        </VaModal>
        <div className="vads-u-border-top--1px vads-u-border-color--gray-light vads-u-margin-top--4">
          <div className={alertClasses}>
            <va-alert
              close-btn-aria-label="Close notification"
              status="warning"
              visible={blockedIssues.length > 0}
              id="blocked-issues-alert"
              role="alert"
            >
              <p className="vads-u-margin-y--0">{blockedMessage}</p>
            </va-alert>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="issues remove-bullets" role="list">
            {issueCards}
          </ul>
        </div>
        {onReviewPage && inReviewMode ? null : (
          <ActionLink
            className="add-new-issue"
            disable-analytics
            path="/add-issue"
            search={`?index=${items.length}`}
            primary
            text="Add a new issue"
          />
        )}
        {showErrorModal && (
          <MaxSelectionsAlert
            showModal
            closeModal={handlers.closeModal}
            appName={props.appName}
          />
        )}
      </fieldset>
    </>
  );
};

ContestableIssues.propTypes = {
  additionalIssues: PropTypes.array,
  apiLoadStatus: PropTypes.string,
  appName: PropTypes.string,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  formData: PropTypes.shape({
    contestedIssues: PropTypes.array,
    additionalIssues: PropTypes.array,
  }),
  id: PropTypes.string,
  options: PropTypes.shape({}),
  setFormData: PropTypes.func,
  testChange: PropTypes.func,
};

const mapStateToProps = state => ({
  apiLoadStatus: state.contestableIssues?.status || '',
  formData: state.form?.data || {},
});

const mapDispatchToProps = {
  setFormData: setData,
};

export { ContestableIssues };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContestableIssues);
