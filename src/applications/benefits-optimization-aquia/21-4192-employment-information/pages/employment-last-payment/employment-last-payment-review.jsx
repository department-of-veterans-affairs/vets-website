import PropTypes from 'prop-types';
import React from 'react';

/**
 * Employment Last Payment Review component
 * Displays last payment information on the review page
 * @param {Object} props - Component props
 * @param {Object} props.data - Complete form data
 * @param {Function} props.editPage - Function to edit this page
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review display for employment last payment
 */
export const EmploymentLastPaymentReview = ({ data, editPage, title }) => {
  const employmentLastPayment = data?.employmentLastPayment || {};

  const formatDate = dateString => {
    if (!dateString) return 'Not provided';
    try {
      // Parse date string as YYYY-MM-DD to avoid timezone issues
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatYesNo = value => {
    if (!value) return 'Not provided';
    return value === 'yes' ? 'Yes' : 'No';
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
          <dt>Date of last payment</dt>
          <dd>{formatDate(employmentLastPayment.dateOfLastPayment)}</dd>
        </div>

        <div className="review-row">
          <dt>Gross amount of last payment</dt>
          <dd>
            {employmentLastPayment.grossAmountLastPayment || 'Not provided'}
          </dd>
        </div>

        <div className="review-row">
          <dt>Was a lump sum payment made?</dt>
          <dd>{formatYesNo(employmentLastPayment.lumpSumPayment)}</dd>
        </div>

        {employmentLastPayment.lumpSumPayment === 'yes' && (
          <>
            <div className="review-row">
              <dt>Gross amount paid</dt>
              <dd>{employmentLastPayment.grossAmountPaid || 'Not provided'}</dd>
            </div>

            <div className="review-row">
              <dt>When was the lump sum paid?</dt>
              <dd>{formatDate(employmentLastPayment.datePaid)}</dd>
            </div>
          </>
        )}
      </dl>
    </div>
  );
};

EmploymentLastPaymentReview.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default EmploymentLastPaymentReview;
