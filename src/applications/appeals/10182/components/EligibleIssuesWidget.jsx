import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import set from 'platform/utilities/data/set';

import { IssueCard } from './IssueCard';
import { SELECTED } from '../constants';
import { $ } from '../utils/ui';
import { someSelected, isEmptyObject } from '../utils/helpers';
import { missingIssuesErrorMessage } from '../content/contestableIssues';

/**
 * EligibleIssuesWidget
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

  const { value = [], id, options, formContext = {} } = props;

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
  const hasSelected =
    someSelected(value) || someSelected(props.additionalIssues);
  const showError = formContext.submitted && !hasSelected;

  const content = itemsLength ? (
    items.map((item, index) => {
      const itemIsSelected = !!item[SELECTED];

      // Don't show un-selected ratings in review mode
      return (inReviewMode && !itemIsSelected) || isEmptyObject(item) ? null : (
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
    })
  ) : (
    <>
      <dt>
        {onReviewPage && !hasSelected ? (
          'No issues selected'
        ) : (
          <strong>No eligible issues found</strong>
        )}
      </dt>
      <dd />
    </>
  );

  // Toggle page class so NewIssueField content also includes a red border
  const article = $('article'); // doesn't work in unit tests
  if (article) {
    article.classList.toggle('error', showError);
  }

  return inReviewMode ? (
    <>
      {showError && missingIssuesErrorMessage}
      {content}
    </>
  ) : (
    <div className={showError ? 'usa-input-error vads-u-margin-top--0' : ''}>
      {showError && missingIssuesErrorMessage}
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

const mapStateToProps = state => ({
  additionalIssues: state.form.data?.additionalIssues || [],
});

export { EligibleIssuesWidget };

export default connect(mapStateToProps)(EligibleIssuesWidget);
