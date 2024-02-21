import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';
import { focusElement, scrollTo } from 'platform/utilities/ui';

import { LAST_ISSUE, MAX_LENGTH, REVIEW_ISSUES, SELECTED } from '../constants';
import { FETCH_CONTESTABLE_ISSUES_FAILED } from '../actions';
import { IssueCard } from './IssueCard';
import {
  ContestableIssuesLegend,
  ApiFailureAlert,
  NoEligibleIssuesAlert,
  NoneSelectedAlert,
  MaxSelectionsAlert,
  removeModalContent,
} from '../content/contestableIssues';
import { focusIssue } from '../utils/focus';
import {
  calculateIndexOffset,
  getSelected,
  someSelected,
} from '../utils/issues';
import { isEmptyObject } from '../utils/helpers';

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

  // combine all issues for viewing
  const items = (formData.contestedIssues || [])
    .map(item => ({
      ...item?.attributes,
      [SELECTED]: item?.[SELECTED],
    }))
    .concat(formData.additionalIssues || []);

  const hasSelected = someSelected(items);
  const showApiFailure =
    !submitted &&
    !onReviewPage &&
    apiLoadStatus === FETCH_CONTESTABLE_ISSUES_FAILED;
  const showNoneSelected =
    !submitted && !onReviewPage && formData.contestedIssues?.length === 0;
  const showEditModeError =
    !showNoneSelected && !hasSelected && (onReviewPage || submitted);

  useEffect(
    () => {
      if (showEditModeError) {
        focusElement('va-alert[status="error"]');
        scrollTo('va-alert[status="error"]');
      }
    },
    [showEditModeError, submitted],
  );

  if (onReviewPage && inReviewMode && items.length && !hasSelected) {
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
      } else if (index < formData.contestedIssues.length) {
        // contestable issue check toggle
        const changedItems = set(
          `contestedIssues[${index}].${SELECTED}`,
          checked,
          formData,
        );
        // only changes value (equal to formData.contestedIssues)
        setFormData(changedItems);
      } else {
        // additional issue check toggle
        const adjustedIndex = calculateIndexOffset(
          index,
          formData.contestedIssues.length,
        );
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
        formData.contestedIssues.length,
      );
      setRemoveIndex(adjustedIndex);
      setShowRemoveModal(true);
    },
    onRemoveModalClose: () => {
      focusIssue(
        null,
        null,
        `${formData.contestedIssues.length + removeIndex},remove-cancel`,
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

  const content = items.map((item, index) => {
    const itemIsSelected = !!item?.[SELECTED];
    const hideCard = (inReviewMode && !itemIsSelected) || isEmptyObject(item);

    const cardProps = {
      id,
      index,
      item,
      key: index,
      options,
      showCheckbox,
      onReviewPage,
      onChange: handlers.onChange,
      onRemove: handlers.onShowRemoveModal,
    };

    // Don't show un-selected ratings in review mode
    return hideCard ? null : <IssueCard {...cardProps} />;
  });

  return (
    <>
      <div name="eligibleScrollElement" />
      {showApiFailure && <ApiFailureAlert />}
      {showNoneSelected && !showApiFailure && <NoEligibleIssuesAlert />}
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
          uswds
        >
          <p>
            {removeIndex !== null
              ? removeModalContent.description(
                  formData.additionalIssues[removeIndex].issue,
                )
              : null}
          </p>
        </VaModal>
        <ul className="issues vads-u-border-top--1px vads-u-border-color--gray-light">
          {content}
        </ul>
        {onReviewPage && inReviewMode ? null : (
          <Link
            className="add-new-issue vads-c-action-link--green"
            to={{
              pathname: '/add-issue',
              search: `?index=${items.length}`,
            }}
          >
            Add a new issue
          </Link>
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
