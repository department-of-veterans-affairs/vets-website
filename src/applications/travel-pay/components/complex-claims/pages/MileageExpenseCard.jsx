import React from 'react';

import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const TripTypeLabels = {
  OneWay: 'One Way',
  RoundTrip: 'Round Trip',
};

const MileageExpenseCard = ({ expense }) => {
  const editExpense = () => {
    // TODO Add logic for this function, it will open the expense in edit mode
  };

  const { address = {}, tripType } = expense;

  return (
    <>
      <div className="review-header-row">
        <p className="review-header vads-u-font-weight--bold vads-u-font-family--sans vads-u-display--inline">
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
      <dl className="review">
        <div className="review-row">
          <dt>Which address did you depart from?</dt>
          <dd>
            <span>
              {address.addressLine1}
              {address.addressLine2 && <div>{address.addressLine2}</div>}
              {address.addressLine3 && <div>{address.addressLine3}</div>}
              {expense.address.city}, {expense.address.stateCode}{' '}
              {expense.address.zipCode}
            </span>
          </dd>
        </div>
        <div className="review-row">
          <dt>Was your trip round trip or one way?</dt>
          <dd>
            <span>{TripTypeLabels[tripType] || tripType}</span>
          </dd>
        </div>
      </dl>
    </>
  );
};

MileageExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
};

export default MileageExpenseCard;
