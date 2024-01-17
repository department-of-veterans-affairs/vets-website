import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';

import {
  getContestableIssues as getContestableIssuesAction,
  FETCH_CONTESTABLE_ISSUES_FAILED,
} from '../../10182/actions';

import { IssueCard } from './IssueCard';
import { APP_NAME } from '../../10182/constants';
import { ContestableIssuesLegend } from '../content/contestableIssues';

import {
  LAST_ISSUE,
  MAX_LENGTH,
  REVIEW_ISSUES,
  SELECTED,
} from '../../shared/constants';
import {
  NoEligibleIssuesAlert,
  NoneSelectedAlert,
  MaxSelectionsAlert,
  removeModalContent,
} from '../../shared/content/contestableIssues';
import { isEmptyObject } from '../../shared/utils/helpers';
import {
  getSelected,
  getIssueNameAndDate,
  someSelected,
  calculateIndexOffset,
} from '../../shared/utils/issues';
import { focusIssue } from '../../shared/utils/focus';
import { copyAreaOfDisagreementOptions } from '../../shared/utils/areaOfDisagreement';

let attempts = 0;

/**
 * ContestableIssuesWidget - Form system parameters passed into this widget
 * @param {Boolean} autofocus - should auto focus
 * @param {Boolean} disabled -  is disabled?
 * @param {Object} formContext -  state
 * @param {String} id - ID base for form elements
 * @param {String} label - label text
 * @param {func} onBlur - blur callback
 * @param {func} onChange - on change callback
 * @param {Object} options - ui:options
 * @param {String} placeholder - placeholder text
 * @param {Boolean} readonly - readonly state
 * @param {Object} registry - contains definitions, fields, widgets & templates
 * @param {Boolean} required - Show required flag
 * @param {Object} schema - array schema
 * @param {Object[]} value - array value
 * @param {Object} contestableIssues - API status & loaded issues
 * @param {func} getContestableIssues - API action
 * @return {JSX}
 */
const ContestableIssuesWidget = props => {
  const {
    value = [],
    id,
    options,
    formContext = {},
    contestableIssues, // API loaded issues
    getContestableIssues,
    additionalIssues,
    setFormData,
    formData,
  } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(null);
  const [editState] = useState(window.sessionStorage.getItem(LAST_ISSUE));

  useEffect(
    () => {
      if (
        attempts < 1 &&
        contestableIssues?.status === FETCH_CONTESTABLE_ISSUES_FAILED
      ) {
        attempts += 1; // only attempt reload once
        getContestableIssues();
      }
    },
    [contestableIssues, getContestableIssues],
  );

  useEffect(
    () => {
      if (editState) {
        focusIssue();
      }
    },
    [editState],
  );

  useEffect(
    () => {
      const areaOfDisagreement = getSelected(formData);
      if (
        areaOfDisagreement?.length !== formData.areaOfDisagreement?.length ||
        !areaOfDisagreement.every(
          (entry, index) =>
            getIssueNameAndDate(entry) ===
            getIssueNameAndDate(formData.areaOfDisagreement[index]),
        )
      ) {
        // Area of Disagreement is created by combining the loaded contestable
        // issues with the Veteran-added additional issues
        setFormData({
          ...formData,
          // save existing settings
          areaOfDisagreement: copyAreaOfDisagreementOptions(
            areaOfDisagreement,
            formData.areaOfDisagreement,
          ),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [formData?.contestedIssues, formData?.additionalIssues],
  );

  const onReviewPage = formContext?.onReviewPage || false;
  window.sessionStorage.setItem(REVIEW_ISSUES, onReviewPage);

  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const inReviewMode = (onReviewPage && formContext.reviewMode) || false;
  const showCheckbox = !onReviewPage || (onReviewPage && !inReviewMode);
  const { submitted } = formContext;

  // combine all issues for viewing
  const items = value
    .map(item => ({
      ...item.attributes,
      [SELECTED]: item[SELECTED],
    }))
    .concat((additionalIssues || []).filter(Boolean));

  const hasSelected = someSelected(items);
  // Only show alert initially when no issues loaded
  const [showNoLoadedIssues] = useState(items.length === 0);

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
      } else if (index < value.length) {
        // contestable issue check toggle
        const changedItems = set(
          `[${index}].${SELECTED}`,
          checked,
          props.value,
        );
        props.onChange(changedItems);
      } else {
        // additional issue check toggle
        const adjustedIndex = calculateIndexOffset(index, value.length);
        const updatedAdditionalIssues = additionalIssues.map(
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
      const adjustedIndex = calculateIndexOffset(cardIndex, value.length);
      setRemoveIndex(adjustedIndex);
      setShowRemoveModal(true);
    },
    onRemoveModalClose: () => {
      focusIssue(null, null, `${value.length + removeIndex},remove-cancel`);
      setShowRemoveModal(false);
      setRemoveIndex(null);
    },
    onRemoveIssue: () => {
      const updatedAdditionalIssues = additionalIssues.filter(
        (issue, indx) => removeIndex !== indx,
      );
      setShowRemoveModal(false);
      setRemoveIndex(null);
      // setTimeout needed to allow rerender
      setTimeout(() => {
        // focusIssue is called by form config scrollAndFocusTarget, but only on
        // page change
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

  const showNoIssues = showNoLoadedIssues && !onReviewPage;

  return (
    <>
      <div name="eligibleScrollElement" />
      {showNoIssues && <NoEligibleIssuesAlert />}
      {!showNoIssues &&
        !hasSelected &&
        (onReviewPage || submitted) && (
          <NoneSelectedAlert
            count={value.length}
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
                  additionalIssues[removeIndex].issue,
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
            appName={APP_NAME}
          />
        )}
      </fieldset>
    </>
  );
};

ContestableIssuesWidget.propTypes = {
  additionalIssues: PropTypes.array,
  contestableIssues: PropTypes.shape({
    status: PropTypes.string,
    issues: PropTypes.array,
    error: PropTypes.string,
  }),
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  formData: PropTypes.shape({
    contestedIssues: PropTypes.array,
    additionalIssues: PropTypes.array,
    areaOfDisagreement: PropTypes.array,
  }),
  getContestableIssues: PropTypes.func,
  id: PropTypes.string,
  options: PropTypes.shape({}),
  setFormData: PropTypes.func,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  contestableIssues: state.contestableIssues,
  additionalIssues: state.form?.data.additionalIssues || [],
});
const mapDispatchToProps = {
  setFormData: setData,
  getContestableIssues: getContestableIssuesAction,
};

export { ContestableIssuesWidget };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContestableIssuesWidget);
