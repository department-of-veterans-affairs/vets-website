import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router';
import ExpenseCardDetails from './ExpenseCardDetails';

const TripTypeLabels = {
  OneWay: 'One way',
  RoundTrip: 'Round trip',
};

const ExpenseCard = ({ expense, editToRoute, header }) => {
  const deleteExpense = expenseId => {
    // TODO Add logic for this function, it will delete the expense
    // eslint-disable-next-line no-console
    console.log(`Delete clicked for expense id: ${expenseId}`);
  };

  const { address = {}, expenseType, tripType } = expense;

  return (
    <va-card>
      <h3 className="vads-u-margin-top--1">{header}</h3>
      {expenseType === 'Mileage' && (
        <ExpenseCardDetails
          items={[
            {
              label: 'Which address did you depart from?',
              value: (
                <>
                  {address.addressLine1}
                  {address.addressLine2 && <div>{address.addressLine2}</div>}
                  {address.addressLine3 && <div>{address.addressLine3}</div>}
                  {address.city}, {address.stateCode} {address.zipCode}
                </>
              ),
            },
            {
              label: 'Was your trip round trip or one way?',
              value: TripTypeLabels[tripType] || tripType,
            },
          ]}
        />
      )}

      <div className="review-button-row">
        <div className="review-edit-button">
          <Link className="active-va-link" to={editToRoute}>
            EDIT
            <va-icon active icon="navigate_next" size={3} aria-hidden="true" />
          </Link>
        </div>

        <va-button-icon
          className="align-items--end"
          data-action="remove"
          button-type="delete"
          onClick={() => deleteExpense(expense.id)}
        />
      </div>
    </va-card>
  );
};

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
  editToRoute: PropTypes.string,
  header: PropTypes.string,
};

export default ExpenseCard;
