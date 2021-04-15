import React from 'react';

// import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

import { SELECTED } from '../constants';
import IssueCards from './IssueCards';

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

  // inReviewMode = true (review page view, not in edit mode)
  // inReviewMode = false (in edit mode)
  const onReviewPage = formContext?.onReviewPage || false;
  const inReviewMode = (onReviewPage && formContext.reviewMode) || false;
  const checkboxVisible = !onReviewPage || (onReviewPage && !inReviewMode);

  const items = value.map(item => ({
    ...item.attributes,
    [SELECTED]: item[SELECTED],
  }));

  const content = (
    <IssueCards
      id={id}
      items={items}
      options={options}
      onReviewPage={onReviewPage}
      inReviewMode={inReviewMode}
      checkboxVisible={checkboxVisible}
      onChange={onChange}
    />
  );

  return inReviewMode ? (
    content
  ) : (
    <div>
      <dl className="review">{content}</dl>
    </div>
  );
};

export default EligibleIssuesWidget;
