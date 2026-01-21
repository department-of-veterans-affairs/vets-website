import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { formatDate } from '../../config/helpers';
import { getConversationLink } from '../../utils/links';

/**
 * @param {{
 *   inquiry: {
 *     status: string,
 *     createdOn: string,
 *     lastUpdate: string,
 *     inquiryNumber: string,
 *     categoryName: string,
 *     submitterQuestion: string
 *   }
 * }} props
 */
export default function InquiryCard({ inquiry }) {
  return (
    <va-card class="inquiry-card" data-testid="dashboard-card">
      <div>
        <h3>
          <span className="sr-only">Status </span>
          <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
            {inquiry.status}
          </span>
          <span className="vads-u-font-size--h4">
            Submitted on{' '}
            <span className="created-date">
              {formatDate(inquiry.createdOn)}
            </span>
          </span>
        </h3>
        <div>
          <span className="vads-u-font-weight--bold">Last updated: </span>
          <span>{formatDate(inquiry.lastUpdate)}</span>
        </div>
      </div>
      <div className="reference-number">
        <span className="vads-u-font-weight--bold">Reference number: </span>
        <span>{inquiry.inquiryNumber}</span>
      </div>
      <div className="multiline-ellipsis-1">
        <span className="vads-u-font-weight--bold">Category: </span>
        <span>{inquiry.categoryName}</span>
      </div>
      <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter" />
      <p className="submitter-question">{inquiry.submitterQuestion}</p>
      <Link
        to={getConversationLink(inquiry.inquiryNumber)}
        className="conversation-link"
      >
        <va-link
          active
          text="Review conversation"
          label={`Review conversation for question submitted on ${formatDate(
            inquiry.createdOn,
            'long',
          )}`}
        />
      </Link>
    </va-card>
  );
}

InquiryCard.propTypes = {
  inquiry: PropTypes.shape({
    status: PropTypes.string.isRequired,
    createdOn: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string.isRequired,
    inquiryNumber: PropTypes.string.isRequired,
    categoryName: PropTypes.string.isRequired,
    submitterQuestion: PropTypes.string.isRequired,
  }).isRequired,
};
