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
import {
  removeModalContent,
  getBlockedMessage,
} from '../content/contestableIssues';
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
  const showCheckbox = !onReviewPage || (onReviewPage && !inReviewMode);
  const { submitted } = formContext;
  const loadedIssues = useMemo(() => formData.contestedIssues || [], [
    formData.contestedIssues,
  ]);

  // Mark issues with decision dates today or in the future as blocked (computed at render time)
  const issuesWithBlocking = useMemo(
    () =>
      loadedIssues.map(issue => {
        const { approxDecisionDate } = issue?.attributes || {};
        const decisionDate = parseDateToDateObj(
          approxDecisionDate,
          FORMAT_YMD_DATE_FNS,
        );
        const isBlockedSameDay = isTodayOrInFuture(decisionDate);

        return {
          ...issue,
          isBlockedSameDay,
        };
      }),
    [loadedIssues],
  );

  const items = issuesWithBlocking
    .map(item => ({
      ...item?.attributes,
      [SELECTED]: item?.[SELECTED],
      isBlockedSameDay: item?.isBlockedSameDay,
    }))
    .concat(formData.additionalIssues || []);

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

  const hasBlockedIssues = items.some(item => item.isBlockedSameDay);

  const blockedIssues = hasBlockedIssues
    ? items.filter(item => item.isBlockedSameDay)
    : [];

  const blockedMessage = getBlockedMessage(blockedIssues.length);

  const issueCards = items.map((item, index) => {
    const itemIsSelected = !!item?.[SELECTED];
    const hideCard = (inReviewMode && !itemIsSelected) || isEmptyObject(item);
    const showSeparator =
      !item.isBlockedSameDay && index > 0 && items[index - 1]?.isBlockedSameDay;

    const cardProps = {
      id,
      index,
      item,
      key: index,
      options,
      showCheckbox,
      onReviewPage,
      showSeparator,
      // props.testChange for testing
      onChange: props.testChange || handlers.onChange,
      onRemove: handlers.onShowRemoveModal,
    };

    // Don't show un-selected ratings in review mode
    return hideCard ? null : <IssueCard {...cardProps} />;
  });

  const content = (
    <>
      {hasBlockedIssues && (
        <va-alert
          close-btn-aria-label="Close notification"
          status="warning"
          visible
          class="vads-u-margin-top--3 vads-u-margin-bottom--2"
          id="blocked-issues-alert"
        >
          <React.Fragment key=".1">
            <p className="vads-u-margin-y--0">{blockedMessage}</p>
            {/* Screen reader only: List of blocked condition names */}
          </React.Fragment>
        </va-alert>
      )}
      {issueCards}
    </>
  );

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
        <ul className="issues remove-bullets vads-u-border-top--1px vads-u-border-color--gray-light">
          {content}
        </ul>
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
