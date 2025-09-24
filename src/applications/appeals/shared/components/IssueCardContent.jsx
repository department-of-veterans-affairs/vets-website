import React from 'react';
import PropTypes from 'prop-types';
import { isValid, format } from 'date-fns';
import { replaceDescriptionContent } from '../utils/replace';
import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';
import { parseDateToDateObj } from '../utils/dates';
import '../definitions';

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
    <div id={id} className="widget-content-wrap">
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
