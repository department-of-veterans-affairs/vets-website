import React from 'react';
import PropTypes from 'prop-types';

import set from 'platform/utilities/data/set';

import { IssueCard } from './IssueCardV1';
import { SELECTED } from '../constants';
import { someSelected, isEmptyObject } from '../utils/helpers';
import { ContestedIssuesAlert } from '../content/contestedIssues';

/**
 * EligibleIssuesWidget (HLR v1)
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
const EligibleIssuesWidget = props => {
  const onChange = (index, checked) => {
    const items = set(`[${index}].${SELECTED}`, checked, props.value);
    props.onChange(items);
  };

  const { value = [], id, options, formContext = {}, required } = props;

  const onReviewPage = formContext?.onReviewPage || false;
  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const inReviewMode = (onReviewPage && formContext.reviewMode) || false;
  const showCheckbox = !onReviewPage || (onReviewPage && !inReviewMode);

  const items = value.map(item => ({
    ...item.attributes,
    [SELECTED]: item[SELECTED],
  }));

  const itemsLength = items.length;
  const hasSelected = someSelected(value);

  if (!itemsLength) {
    return onReviewPage && inReviewMode ? (
      <>
        <dt>
          <strong>No eligible issues found</strong>
        </dt>
        <dd />
      </>
    ) : null; // h2 shown on page (not review & submit page)
  }

  if (onReviewPage && inReviewMode && !hasSelected) {
    return (
      <>
        <dt>No issues selected</dt>
        <dd />
      </>
    );
  }

  const showError = required && formContext.submitted && !hasSelected;
  const wrapperClass = showError ? 'usa-input-error vads-u-margin-top--0' : '';

  const content = items.map((item, index) => {
    const itemIsSelected = !!item[SELECTED];
    const hideCard = (inReviewMode && !itemIsSelected) || isEmptyObject(item);

    // Don't show un-selected ratings in review mode
    return hideCard ? null : (
      <IssueCard
        key={index}
        id={id}
        index={index}
        item={item}
        options={options}
        onChange={onChange}
        showCheckbox={showCheckbox}
      />
    );
  });

  return onReviewPage && inReviewMode ? (
    content
  ) : (
    <div className={wrapperClass}>
      {showError && <ContestedIssuesAlert />}
      <dl className="review">{content}</dl>
    </div>
  );
};

EligibleIssuesWidget.propTypes = {
  id: PropTypes.string,
  options: PropTypes.shape({}),
  formContext: PropTypes.shape({
    onReviewPage: PropTypes.bool,
    reviewMode: PropTypes.bool,
    submitted: PropTypes.bool,
  }),
  value: PropTypes.array,
};

export default EligibleIssuesWidget;
