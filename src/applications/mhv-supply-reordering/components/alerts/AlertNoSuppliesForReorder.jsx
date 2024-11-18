import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DlcEmailLink from '../DlcEmailLink';
import DlcTelephoneLink from '../DlcTelephoneLink';

/**
 * Generates an alert for a veteran that is not eligible to order supplies.
 * @param {string} reorderDate the date supplies will be available to reorder
 * @returns the alert
 */
const AlertNoSuppliesForReorder = ({ reorderDate }) => {
  const formattedDate = format(new Date(reorderDate), 'MMMM d, yyyy');
  return (
    <va-alert
      status="warning"
      data-testid="reorder-alert--no-supplies-for-reorder"
    >
      <h3 slot="headline">You can’t reorder your items at this time</h3>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <span>
          Our records show that your items aren’t available for reorder until{' '}
          {formattedDate}. You can only order items once every 5 months.
        </span>
        <span className="vads-u-margin-top--1">
          If you need an item sooner, call the DLC Customer Service Section at{' '}
          <DlcTelephoneLink /> or email <DlcEmailLink />.
        </span>
      </div>
    </va-alert>
  );
};

AlertNoSuppliesForReorder.propTypes = {
  reorderDate: PropTypes.string.isRequired,
};

export default AlertNoSuppliesForReorder;
