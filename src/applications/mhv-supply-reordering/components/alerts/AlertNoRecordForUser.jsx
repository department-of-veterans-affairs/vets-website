import React from 'react';
import { HEALTH_FACILITIES_URL } from '../../constants';

const AlertNoRecordForUser = () => (
  <va-alert
    status="warning"
    data-testid="reorder-alert--no-record-for-user"
    class="vads-u-margin-bottom--5"
  >
    <h3 slot="headline">We can’t find your records in our system</h3>
    <div className="vads-u-display--flex vads-u-flex-direction--column">
      <span>
        You can’t order hearing aid or CPAP supplies at this time because we
        find your records in our system or we’re missing some information needed
        for you to order.
      </span>

      <span className="vads-u-margin-top--1">
        If you think this is incorrect, call your health care provider to update
        your record.{' '}
        <a
          href={HEALTH_FACILITIES_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find contact information for your local medical center.
        </a>
      </span>
    </div>
  </va-alert>
);

export default AlertNoRecordForUser;
