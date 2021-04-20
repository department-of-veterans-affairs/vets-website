import React from 'react';
import { format } from 'date-fns';

import { SELECTED } from '../constants';

/**
 * IssueCardContent
 * @param {String} description - contestable issue description
 * @param {String} ratingIssuePercentNumber - rating %, number with no %
 * @param {String} approxDecisionDate - date formatted as "YYYY-MM-DD"
 * @return {React Component}
 */
export const IssueCardContent = ({
  description,
  ratingIssuePercentNumber,
  approxDecisionDate,
}) => {
  // May need to throw an error to Sentry if any of these don't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = (ratingIssuePercentNumber || '') !== '';

  return (
    <>
      {description && (
        <p className="vads-u-margin-bottom--0">{description || ''}</p>
      )}
      {showPercentNumber && (
        <p className="vads-u-margin-bottom--0">
          Current rating: <strong>{ratingIssuePercentNumber}%</strong>
        </p>
      )}
      {approxDecisionDate && (
        <p>
          Decision date:{' '}
          <strong>
            {format(new Date(approxDecisionDate), 'MMMM d, yyyy')}
          </strong>
        </p>
      )}
    </>
  );
};

/**
 * ContestableIssue
 * @typedef {Object}
 * @property {String} ratingIssueSubjectText - contestable issue title
 * @property {String} description - contestable issue description
 * @property {String} ratingIssuePercentNumber - rating %, number with no %
 * @property {String} approxDecisionDate - date formatted as "YYYY-MM-DD"
 */
/**
 * AdditionalIssue
 * @type {Object}
 * @property {String} condition - user entered issue name
 * @property {String} approxDecisionDate - user entered decision date
 */
/**
 * IssueCard
 * @typedef {Object}
 * @property {String} id - ID base for form elements
 * @property {Number} index - index of item in list
 * @property {Boolean} isLastItem - flag indicating the entry is last
 * @property {ContestableIssue|AdditionalIssue} item - issue values
 * @property {Object} options - ui:options
 * @property {func} onChange - onChange callback
 * @property {Boolean} showCheckbox - don't show checkbox on review & submit
 *  page when not in edit mode
 */
export const IssueCard = ({
  id,
  index,
  isLastItem = false,
  item = {},
  options,
  onChange,
  showCheckbox,
}) => {
  // On the review & submit page, there may be more than one
  // of these components in edit mode with the same content, e.g. 526
  // ratedDisabilities & unemployabilityDisabilities causing
  // duplicate input ids/names... an `appendId` value is added to the
  // ui:options
  const appendId = options.appendId ? `_${options.appendId}` : '';
  const elementId = `${id}_${index}${appendId}`;

  const itemIsSelected = item[SELECTED];

  const wrapperClass = [
    'review-row',
    'widget-wrapper',
    'vads-u-border--0',
    showCheckbox ? '' : 'checkbox-hidden',
    `vads-u-padding-top--${showCheckbox ? 1 : 0}`,
    'vads-u-padding-right--3',
    isLastItem ? '' : 'vads-u-margin-bottom--3',
  ].join(' ');

  const outlineClass = [
    'widget-outline',
    'vads-u-margin-top--0',
    itemIsSelected ? 'selected' : '',
  ].join(' ');

  // item.condition = additional item
  // item.ratingIssuesSubjectText = eligible issue from API
  const title = item.condition || item.ratingIssueSubjectText;
  const titleClass = [
    'widget-title',
    'vads-u-font-size--md',
    'vads-u-font-weight--bold',
    'vads-u-line-height--1',
  ].join(' ');

  const widgetContent = 'widget-content vads-u-font-weight--normal';

  return (
    <div className={wrapperClass} key={index}>
      <dt className="widget-checkbox-wrap">
        {showCheckbox ? (
          <>
            <input
              type="checkbox"
              id={elementId}
              name={elementId}
              checked={itemIsSelected}
              onChange={event => onChange(index, event.target.checked)}
            />
            <label
              className={`schemaform-label ${outlineClass}`}
              htmlFor={elementId}
            >
              <div className={titleClass}>{title}</div>
            </label>
          </>
        ) : (
          <div className={outlineClass} />
        )}
      </dt>
      <dd className={widgetContent}>
        {!showCheckbox && <div className={titleClass}>{title}</div>}
        <IssueCardContent {...item} />
      </dd>
    </div>
  );
};
