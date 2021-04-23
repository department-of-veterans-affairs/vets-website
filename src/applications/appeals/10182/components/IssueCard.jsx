import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

import { SELECTED } from '../constants';

/**
 * IssueCardContent
 * @param {String} description - contestable issue description
 * @param {String} ratingIssuePercentNumber - rating %, number with no %
 * @param {String} approxDecisionDate - contestable issue date formatted as
 *   "YYYY-MM-DD"
 * @param {String} decisionDate - additional issue date formatted as
 *   "YYYY-MM-DD"
 * @return {React Component}
 */
export const IssueCardContent = ({
  description,
  ratingIssuePercentNumber,
  approxDecisionDate,
  decisionDate,
}) => {
  // May need to throw an error to Sentry if any of these don't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = (ratingIssuePercentNumber || '') !== '';
  const date = approxDecisionDate || decisionDate;

  return (
    <div className="widget-content-wrap">
      {description && <p className="vads-u-margin-bottom--0">{description}</p>}
      {showPercentNumber && (
        <p className="vads-u-margin-bottom--0">
          Current rating: <strong>{ratingIssuePercentNumber}%</strong>
        </p>
      )}
      {date && (
        <p>
          Decision date:{' '}
          <strong>
            {format(new Date(`${date} 00:00:00`), 'MMMM d, yyyy')}
          </strong>
        </p>
      )}
    </div>
  );
};

IssueCardContent.propTypes = {
  decisionDate: PropTypes.string,
  description: PropTypes.string,
  ratingIssuePercentNumber: PropTypes.string,
  approxDecisionDate: PropTypes.string,
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
 * @property {String} issue - user entered issue name
 * @property {String} decisionDate - user entered decision date
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
  options = {},
  onChange,
  showCheckbox,
  onEdit,
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

  // item.issue = additional item
  // item.ratingIssuesSubjectText = eligible issue from API
  const title = (
    <div className="widget-title vads-u-font-size--md vads-u-font-weight--bold vads-u-line-height--1">
      {item.issue || item.ratingIssueSubjectText}
    </div>
  );

  const editButton =
    showCheckbox && typeof onEdit === 'function' ? (
      <button
        type="button"
        className="usa-button-secondary edit vads-u-flex--auto"
        aria-label={`Edit issue`}
        onClick={onEdit}
      >
        Edit
      </button>
    ) : null;

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
              {title}
            </label>
          </>
        ) : (
          <div className={outlineClass} />
        )}
      </dt>
      <dd
        className={`${
          editButton ? 'widget-edit vads-u-padding-bottom--1' : ''
        } widget-content vads-u-font-weight--normal`}
        data-index={index}
      >
        {!showCheckbox && title}
        <IssueCardContent {...item} />
        {editButton}
      </dd>
    </div>
  );
};

IssueCard.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  isLastItem: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  item: PropTypes.shape({
    // not using oneOf because there is a lot of extra props in here
    issue: PropTypes.string,
    decisionDate: PropTypes.string,
    ratingIssueSubjectText: PropTypes.string,
    description: PropTypes.string,
    ratingIssuePercentNumber: PropTypes.string,
    approxDecisionDate: PropTypes.string,
    [SELECTED]: PropTypes.bool,
  }),
  options: PropTypes.shape({
    appendId: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
};
