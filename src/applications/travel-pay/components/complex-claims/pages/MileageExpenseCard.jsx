import React from 'react';

import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
const TripTypeLabels = {
  OneWay: 'One Way',
  RoundTrip: 'Round Trip',
};

const MileageExpenseCard = ({ expense }) => {
  const editExpense = () => {
    // TODO this function will open the expense in edit mode
    console.log('Edit expense clicked');
  };

  return (
    <>
      <div className="form-header-row">
        <p className="form-header vads-u-font-weight--bold vads-u-font-family--sans vads-u-display--inline">
          About your route
        </p>
        <div className="vads-u-justify-content--flex-end">
          <VaButton
            id="edit-expense-button"
            className="vads-u-display--flex"
            text="Edit"
            secondary
            onClick={editExpense}
          />
        </div>
      </div>
      <dl>
        <div>
          <dt>Which address did you depart from?</dt>
          <dd>
            {' '}
            <span>
              {expense.address.addressLine1} {expense.address.addressLine2}{' '}
              {expense.address.addressLine3}
              <br />
              {expense.address.city}, {expense.address.stateCode}{' '}
              {expense.address.zipCode}
            </span>
          </dd>
        </div>
      </dl>
      <dl>
        <div>
          <dt>Was your trip round trip or one way?</dt>
          <dd>
            <span>{TripTypeLabels[expense.tripType] || expense.tripType}</span>
          </dd>
        </div>
      </dl>
      <p>Which address did you depart from?</p>
    </>
  );
};

MileageExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
};

export default MileageExpenseCard;
