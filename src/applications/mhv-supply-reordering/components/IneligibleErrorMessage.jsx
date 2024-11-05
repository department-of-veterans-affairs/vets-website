import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import DlcServiceTelephone from './DlcSupportTelephone';

/**
 * Generates an alert for a veteran that is not eligible to order supplies.
 * @param {string} nextAvailabilityDate the date supplies will be available to reorder
 * @returns the alert
 */
const IneligibleErrorMessage = ({ nextAvailabilityDate }) => {
  const formattedDate = format(new Date(nextAvailabilityDate), 'MMMM d, yyyy');
  return (
    <va-alert status="warning" data-testid="mhv-supply-intro-ineligible">
      <h3 slot="headline">You can’t reorder your items at this time</h3>
      <div className="vads-u-display--flex vads-u-flex-direction--column">
        <span>
          Our records show that your items aren’t available for reorder until{' '}
          {formattedDate}. You can only order items once every 5 months.
        </span>
        <span className="vads-u-margin-top--1">
          If you need an item sooner, call the DLC Customer Service Section at{' '}
          <DlcServiceTelephone /> or email{' '}
          <a href="mailto:dalc.css@va.gov">dalc.css@va.gov</a>.
        </span>
      </div>
    </va-alert>
  );
};

IneligibleErrorMessage.propTypes = {
  nextAvailabilityDate: PropTypes.string.isRequired,
};

export default IneligibleErrorMessage;
