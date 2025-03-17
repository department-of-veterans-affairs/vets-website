import React from 'react';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import { Link } from 'react-router';
import { VaCheckbox } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { replaceDescriptionContent } from '../utils/replace';
import {
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
  SELECTED,
} from '../constants';
import { parseDateToDateObj } from '../utils/dates';
import '../definitions';

// It would be better to validate the date based on the app's requirements
// import { isValidDate } from '../validations/date';

/**
 * IssueCardContent
 * @param {String} id - unique ID
 * @param {String} description - contestable issue description
 * @param {String} ratingIssuePercentNumber - rating %, number with no %
 * @param {String} approxDecisionDate - contestable issue date formatted as
 *   "YYYY-MM-DD"
 * @param {String} decisionDate - additional issue date formatted as
 *   "YYYY-MM-DD"
 * @return {JSX.Element}
 */
export const IssueCardContent = ({
  id,
  description,
  ratingIssuePercentNumber,
  approxDecisionDate,
  decisionDate,
}) => {
  // May need to throw an error to DataDog if any of these don't exist
  // A valid rated disability *can* have a rating percentage of 0%
  const showPercentNumber = (ratingIssuePercentNumber || '') !== '';
  const date = parseDateToDateObj(
    approxDecisionDate || decisionDate || null,
    FORMAT_YMD_DATE_FNS,
  );

  // const dateMessage = isValidDate(date) ? (
  const dateMessage = isValid(date) ? (
    <strong
      className="dd-privacy-hidden"
      data-dd-action-name="rated issue decision date"
    >
      {format(date, FORMAT_READABLE_DATE_FNS)}
    </strong>
  ) : (
    <span className="usa-input-error-message vads-u-display--inline">
      Invalid decision date
    </span>
  );

  return (
    <div id={id} className="vads-u-width--full">
      {description && (
        <p
          className="vads-u-margin-bottom--0 dd-privacy-hidden"
          data-dd-action-name="rated issue description"
        >
          {replaceDescriptionContent(description)}
        </p>
      )}
      {showPercentNumber && (
        <p className="vads-u-margin-bottom--0">
          Current rating:{' '}
          <strong
            className="dd-privacy-hidden"
            data-dd-action-name="rated issue percentage"
          >
            {`${ratingIssuePercentNumber}%`}
          </strong>
        </p>
      )}
      <p>Decision date: {dateMessage}</p>
    </div>
  );
};

IssueCardContent.propTypes = {
  approxDecisionDate: PropTypes.string,
  decisionDate: PropTypes.string,
  description: PropTypes.string,
  id: PropTypes.string,
  ratingIssuePercentNumber: PropTypes.string,
};

/**
 * IssueCard
 * @param {String} id - ID base for form elements
 * @param {Number} index - index of item in list
 * @param {ContestableIssueItem|AdditionalIssueItem} item - issue values
 * @param {Object} options - ui:options
 * @param {func} onChange - onChange callback
 * @param {Boolean} showCheckbox - don't show checkbox on review & submit
 * @param {func} onRemove - remove issue callback
 *  page when not in edit mode
 * @param {Boolean} onReviewPage - When true, list is rendered on review page
 * @return {JSX.Element}
 */
export const IssueCard = ({
  index,
  item = {},
  onChange,
  showCheckbox,
  onRemove,
}) => {
  const isEditable = !!item.issue;
  const issueName = item.issue || item.ratingIssueSubjectText;

  const wrapperClass = [
    'widget-wrapper',
    isEditable ? 'additional-issue' : '',
    showCheckbox ? '' : 'checkbox-hidden',
    showCheckbox ? '' : 'vads-u-padding-top--2',
    showCheckbox ? '' : 'vads-u-margin-bottom--0',
    showCheckbox ? '' : 'vads-u-border-bottom--1px',
    showCheckbox ? '' : 'vads-u-border-color--gray-light',
  ].join(' ');

  const removeButtonClass = [
    'remove-issue',
    'vads-u-width--auto',
    'vads-u-margin-left--2',
    'vads-u-margin-top--0',
  ].join(' ');

  const handlers = {
    stopEvent: event => {
      event.preventDefault();
      event.stopPropagation();
    },
    onRemove: event => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(index);
    },
    onChange: event => onChange(index, event),
  };

  const editControls =
    showCheckbox && isEditable ? (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={handlers.stopEvent}>
        <Link
          to={{
            pathname: '/add-issue',
            search: `?index=${index}`,
          }}
          className="edit-issue-link"
          aria-label={`Edit ${issueName}`}
        >
          Edit
        </Link>
        <va-button
          secondary
          class={removeButtonClass}
          label={`remove ${issueName}`}
          onClick={handlers.onRemove}
          text="Remove"
        />
      </div>
    ) : null;

  return (
    <li id={`issue-${index}`} name={`issue-${index}`} key={index}>
      <div className={wrapperClass}>
        {showCheckbox ? (
          <div className="dd-privacy-hidden" data-dd-action-name="Issue name">
            <VaCheckbox
              label={issueName}
              checked={item[SELECTED]}
              tile
              onVaChange={handlers.onChange}
            >
              <div slot="internal-description">
                <IssueCardContent id={`issue-${index}-description`} {...item} />
                {editControls}
              </div>
            </VaCheckbox>
          </div>
        ) : (
          <>
            <div
              className="dd-privacy-hidden"
              data-dd-action-name="rated issue name"
            >
              <strong>{issueName}</strong>
            </div>
            <IssueCardContent id={`issue-${index}-description`} {...item} />
            {editControls}
          </>
        )}
      </div>
    </li>
  );
};

IssueCard.propTypes = {
  id: PropTypes.string,
  index: PropTypes.number,
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
  showCheckbox: PropTypes.bool,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  onReviewPage: PropTypes.bool,
};
