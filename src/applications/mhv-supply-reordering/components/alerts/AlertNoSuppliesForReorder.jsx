import React from 'react';
import PropTypes from 'prop-types';
import DlcEmailLink from '../DlcEmailLink';
import DlcTelephoneLink from '../DlcTelephoneLink';
import { formatDate } from '../../utils/helpers';

/**
 * Generates an alert for a veteran that is not eligible to order supplies.
 * @param {string} reorderDate the date supplies will be available to reorder
 * @returns the alert
 */
const AlertNoSuppliesForReorder = ({ reorderDate }) => {
  const date = reorderDate ? formatDate(reorderDate) : undefined;
  return (
    <va-alert
      status="warning"
      data-testid="reorder-alert--no-supplies-for-reorder"
      class="vads-u-margin-bottom--5"
    >
      <h3 slot="headline">You can’t reorder your items at this time</h3>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        {date && (
          <span>
            Our records show that your items aren’t available for reorder until{' '}
            {date}. You can only order items once every 5 months.
          </span>
        )}
        <span className="vads-u-margin-top--1">
          If you need an item sooner, call the DLC Customer Service Section at{' '}
          <DlcTelephoneLink /> or email <DlcEmailLink />.
        </span>
      </div>
    </va-alert>
  );
};

AlertNoSuppliesForReorder.propTypes = {
  reorderDate: PropTypes.string,
};

export default AlertNoSuppliesForReorder;
