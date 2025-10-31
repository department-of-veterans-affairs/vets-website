import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, getVAStatusFromCRM } from '../../config/helpers';
import { getConversationLink } from '../../utils/links';

export default function InquiryCard({ inquiry }) {
  return (
    <li className="dashboard-card-list">
      <va-card class="vacard">
        <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--0">
          <span className="vads-u-margin-bottom--1p5 vads-u-display--block">
            <span className="sr-only">Status</span>
            <span>
              <span className="usa-label vads-u-font-weight--normal vads-u-font-family--sans">
                {getVAStatusFromCRM(inquiry.status)}
              </span>
            </span>
          </span>
          <span className="vads-u-display--block vads-u-font-size--h4 vads-u-margin-top--1p">
            {`Submitted on ${formatDate(inquiry.createdOn)}`}
          </span>
        </h3>
        <dl>
          <div className="vads-u-margin--0 vads-u-padding-bottom--1">
            <dt className="vads-u-font-weight--bold vads-u-display--inline">
              Last updated:
            </dt>{' '}
            <dd className="vads-u-display--inline">
              {formatDate(inquiry.lastUpdate)}
            </dd>
          </div>
          <div className="vads-u-margin--0 vads-u-padding-bottom--1">
            <dt className="vads-u-font-weight--bold vads-u-display--inline">
              Reference number:
            </dt>{' '}
            <dd className="vads-u-display--inline">{inquiry.inquiryNumber}</dd>
          </div>
          <div className="vads-u-margin-bottom--0 vacardCategory multiline-ellipsis-1">
            <dt className="vads-u-font-weight--bold vads-u-display--inline">
              Category:
            </dt>{' '}
            <dd className="vads-u-display--inline">{inquiry.categoryName}</dd>
          </div>
        </dl>
        <div className="vads-u-border-bottom--1px vads-u-border-color--gray-lighter vads-u-margin-bottom--1 vads-u-margin-top--1p5" />
        <p className="vacardSubmitterQuestion">{inquiry.submitterQuestion}</p>
        <div className="vads-u-margin-top--1p5">
          <va-link
            active
            href={getConversationLink(inquiry.inquiryNumber)}
            text="Review conversation"
            label={`Review conversation for question submitted on ${formatDate(
              inquiry.createdOn,
              'long',
            )}`}
          />
        </div>
      </va-card>
    </li>
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
