import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router';

import { SELECTED, FORMAT_READABLE } from '../constants';
/** HLR v1 card */
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
          Decision date: <strong>{moment(date).format(FORMAT_READABLE)}</strong>
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
 * @property {ContestableIssue|AdditionalIssue} item - issue values
 * @property {Object} options - ui:options
 * @property {func} onChange - onChange callback
 * @property {func} onRemove - remove issue callback
 * @property {Boolean} showCheckbox - don't show checkbox on review & submit
 *  page when not in edit mode
 */
export const IssueCard = ({
  id,
  index,
  item = {},
  options = {},
  onChange,
  showCheckbox,
  onRemove,
}) => {
  // On the review & submit page, there may be more than one
  // of these components in edit mode with the same content, e.g. 526
  // ratedDisabilities & unemployabilityDisabilities causing
  // duplicate input ids/names... an `appendId` value is added to the
  // ui:options
  const appendId = options.appendId ? `_${options.appendId}` : '';
  const elementId = `${id}_${index}${appendId}`;

  const itemIsSelected = item[SELECTED];
  const isEditable = !!item.issue;
  const issueName = item.issue || item.ratingIssueSubjectText;

  const wrapperClass = [
    'review-row',
    'widget-wrapper-v2',
    'vads-u-border-top--1px',
    isEditable ? 'additional-issue' : '',
    showCheckbox ? '' : 'checkbox-hidden',
    `vads-u-padding-top--${showCheckbox ? 3 : 0}`,
    'vads-u-padding-right--3',
    'vads-u-margin-bottom--0',
  ].join(' ');

  // item.issue = additional item
  // item.ratingIssuesSubjectText = eligible issue from API
  const title = (
    <div className="widget-title vads-u-font-size--md vads-u-font-weight--bold vads-u-line-height--1">
      {issueName}
    </div>
  );

  const editControls =
    showCheckbox && isEditable ? (
      <div>
        <Link
          to={{
            pathname: '/add-issue',
            search: `?index=${index}`,
          }}
          className="change-issue-link"
          aria-label={`Change ${issueName}`}
        >
          Change
        </Link>
        <button
          type="button"
          className="usa-button-secondary vads-u-width--auto vads-u-margin-left--2 vads-u-margin-top--0"
          aria-label={`remove ${issueName}`}
          onClick={event => {
            event.preventDefault();
            onRemove(index, item);
          }}
        >
          Remove
        </button>
      </div>
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
              onChange={event => onChange(index, event)}
            />
            <label className="schemaform-label" htmlFor={elementId}>
              <span className="vads-u-visibility--screen-reader">
                {issueName}
              </span>
            </label>
          </>
        ) : (
          <div />
        )}
      </dt>
      <dd
        className={`${
          editControls ? 'widget-editable vads-u-padding-bottom--1' : ''
        } widget-content vads-u-font-weight--normal`}
        data-index={index}
      >
        {title}
        <IssueCardContent {...item} />
        {editControls}
      </dd>
    </div>
  );
};

IssueCard.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
  showCheckbox: PropTypes.bool,
  item: PropTypes.shape({
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
