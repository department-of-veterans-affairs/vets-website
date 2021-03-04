import React from 'react';
import { PAGE_NAMES } from '../constants';

const DebtError = () => {
  return (
    <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
      <p className="vads-u-margin-top--0">
        Based on the information you provided, this isn’t the form you need.
      </p>
      <p>
        <strong>
          If you think your debt or the amount of your debt is due to an error,
        </strong>{' '}
        you can dispute it. Submit a written statement to tell us why you
        dispute the debt.
      </p>
      <p>You can submit your dispute statement online or by mail.</p>
      <ul>
        <li>
          <strong>Online: </strong>
          <a href="https://iris.custhelp.va.gov/app/ask">
            Go to our online question form (called IRIS)
          </a>
          . On the IRIS page, select <strong>Debt Management Center</strong>,
          your debt type, and <strong>Dispute</strong> within the Topic
          dropdown. For Inquiry Type, select <strong>Question</strong>.
        </li>
        <li>
          <strong>Mail: </strong>
          <div>Debt Management Center</div>
          <div>P.O. Box 11930</div>
          <div>St. Paul, MN 55111-0930</div>
        </li>
      </ul>
      <p>
        <strong>Note: </strong>
        Note: You have <strong>180 days</strong> from the date you received your
        first debt letter to submit your dispute statement. After this time, we
        can’t consider the request.
      </p>
      <p>
        We encourage you to submit your dispute statement within{' '}
        <strong>30 days</strong>. If we receive the statement within 30 days, we
        won’t add late fees and interest, or take other collection action, while
        we review your dispute.
      </p>
    </div>
  );
};

export default {
  name: PAGE_NAMES.error,
  component: DebtError,
};
