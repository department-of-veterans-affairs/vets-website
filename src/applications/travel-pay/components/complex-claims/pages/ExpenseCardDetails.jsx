import React from 'react';
import PropTypes from 'prop-types';

const ExpenseCardDetails = ({ items }) => {
  return (
    <>
      {items.map(({ label, value }) => (
        <div key={label} className="expense-card-details vads-u-margin-top--2">
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
      value: PropTypes.node.isRequired,
    }),
  ).isRequired,
};

export default ExpenseCardDetails;
