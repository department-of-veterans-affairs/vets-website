import PropTypes from 'prop-types';
import React from 'react';

/**
 * Monthly Costs Review component
 * Displays monthly costs information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for monthly costs
 */
export const MonthlyCostsReview = ({ data, editPage, title }) => {
  const { monthlyOutOfPocket } = data?.monthlyCosts || {};

  const formatCurrency = amount => {
    if (!amount && amount !== 0) return 'Not provided';

    // Convert string to number if needed
    const numericAmount =
      typeof amount === 'string'
        ? parseFloat(amount.replace(/[^0-9.-]/g, ''))
        : amount;

    if (Number.isNaN(numericAmount)) return 'Not provided';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericAmount);
  };

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
        <va-button secondary uswds text="Edit" onClick={editPage} />
      </div>

      <dl className="review">
        <div className="review-row">
          <dt>Monthly out-of-pocket amount</dt>
          <dd>{formatCurrency(monthlyOutOfPocket)}</dd>
        </div>
      </dl>
    </div>
  );
};

MonthlyCostsReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
