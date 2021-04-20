import React from 'react';

import set from 'platform/utilities/data/set';

import { SELECTED } from '../constants';
import { IssueCard } from './IssueCard';

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
  const showCheckbox = !onReviewPage || (onReviewPage && !inReviewMode);

  const items = value.map(item => ({
    ...item.attributes,
    [SELECTED]: item[SELECTED],
  }));

  const itemsLength = items.length;

  const content = itemsLength ? (
    items.map((item, index) => {
      const itemIsSelected = !!item[SELECTED];
      const isLastItem = index === itemsLength - 1;

      // Don't show un-selected ratings in review mode
      return inReviewMode && !itemIsSelected ? null : (
        <IssueCard
          key={index}
          id={id}
          index={index}
          isLastItem={isLastItem}
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
        {onReviewPage ? 'No issues selected' : <strong>No issues found</strong>}
      </dt>
      <dd />
    </>
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
