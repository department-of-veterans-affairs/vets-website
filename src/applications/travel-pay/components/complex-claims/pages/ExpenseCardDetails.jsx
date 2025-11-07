import React from 'react';
import PropTypes from 'prop-types';

const ExpenseCardDetails = ({ items }) => {
  return (
    <>
      {/* Only render the label and value if the value is not null, undefined or empty */}
      {items
        .filter(
          ({ value }) => value !== null && value !== undefined && value !== '',
        )
        .map(({ label, value }) => (
          <div
            key={label}
            className="expense-card-details vads-u-margin-top--2"
          >
            <p className="vads-u-font-weight--bold">{label}</p>
            <p>{value}</p>
          </div>
        ))}
    </>
  );
};

ExpenseCardDetails.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node,
    }),
  ).isRequired,
};

export default ExpenseCardDetails;
