import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import set from 'platform/utilities/data/set';
import { setData } from 'platform/forms-system/src/js/actions';

import { IssueCard } from './IssueCard';
import { SELECTED, MAX_LENGTH, LAST_SC_ITEM } from '../constants';
import {
  ContestableIssuesLegend,
  NoIssuesLoadedAlert,
  NoneSelectedAlert,
  MaxSelectionsAlert,
} from '../content/contestableIssues';
import {
  getSelected,
  someSelected,
  isEmptyObject,
  calculateIndexOffset,
} from '../utils/helpers';

/**
 * ContestableIssuesWidget
 * Form system parameters passed into this widget
 * @typedef {Object}
 * @property {Boolean} autofocus - should auto focus
 * @property {Boolean} disabled -  is disabled?
 * @property {Object} formContext -  state
 * @property {String} id - ID base for form elements
 * @property {String} label - label text
 * @property {func} onBlur - blur callback
 * @property {func} onChange - on change callback
 * @property {Object} options - ui:options
 * @property {String} placeholder - placeholder text
 * @property {Boolean} readonly - readonly state
 * @property {Object} registry - contains definitions, fields, widgets & templates
 * @property {Boolean} required - Show required flag
 * @property {Object} schema - array schema
 * @property {Object[]} value - array value
 */
const ContestableIssuesWidget = props => {
  const {
    value = [],
    id,
    options,
    formContext = {},
    additionalIssues,
    setFormData,
    formData,
  } = props;

  const [showErrorModal, setShowErrorModal] = useState(false);

  const onReviewPage = formContext?.onReviewPage || false;
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
    .concat(additionalIssues);

  const hasSelected = someSelected(items);

  if (onReviewPage && inReviewMode && items.length && !hasSelected) {
    return (
      <>
        <dt>
          <NoneSelectedAlert count={items.length} />
        </dt>
        <dd />
      </>
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
    onRemoveIssue: index => {
      const adjustedIndex = calculateIndexOffset(index, value.length);
      const updatedAdditionalIssues = additionalIssues.filter(
        (issue, indx) => adjustedIndex !== indx,
      );

      // Focus management: target the previous issue if the last one was removed
      // Done internally within the issue card component
      const focusIndex =
        index + (adjustedIndex >= updatedAdditionalIssues.length ? -1 : 0);
      window.sessionStorage.setItem(LAST_SC_ITEM, focusIndex);

      setFormData({
        ...formData,
        additionalIssues: updatedAdditionalIssues,
      });
    },
  };

  const content = items.map((item, index) => {
    const itemIsSelected = !!item[SELECTED];
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
      // Don't allow editing or removing API-loaded issues
      onRemove: item.ratingIssueSubjectText
        ? null
        : () => handlers.onRemoveIssue(index),
    };

    // Don't show un-selected ratings in review mode
    return hideCard ? null : <IssueCard {...cardProps} />;
  });

  const showNoIssues =
    items.length === 0 && (!onReviewPage || (onReviewPage && inReviewMode));

  return (
    <>
      <div name="eligibleScrollElement" />
      {showNoIssues && <NoIssuesLoadedAlert submitted={submitted} />}
      {!showNoIssues &&
        submitted &&
        !hasSelected && <NoneSelectedAlert count={value.length} />}
      <fieldset className="review-fieldset">
        <ContestableIssuesLegend
          onReviewPage={onReviewPage}
          inReviewMode={inReviewMode}
        />
        <dl className="review">{content}</dl>
        {onReviewPage && inReviewMode ? null : (
          <Link
            className="add-new-issue vads-c-action-link--green"
            to={{ pathname: '/add-issue', search: `?index=${items.length}` }}
          >
            Add a new issue
          </Link>
        )}
        {showErrorModal && (
          <MaxSelectionsAlert showModal closeModal={handlers.closeModal} />
        )}
      </fieldset>
    </>
  );
};

ContestableIssuesWidget.propTypes = {
  additionalIssues: PropTypes.array,
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  formData: PropTypes.shape({
    contestedIssues: PropTypes.array,
  }),
  id: PropTypes.string,
  options: PropTypes.shape({}),
  setFormData: PropTypes.func,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

const mapStateToProps = state => ({
  formData: state.form?.data || {},
  additionalIssues: state.form?.data.additionalIssues || [],
});
const mapDispatchToProps = {
  setFormData: setData,
};

export { ContestableIssuesWidget };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContestableIssuesWidget);
