import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import ExpenseCardDetails from './ExpenseCardDetails';
import DeleteExpenseModal from './DeleteExpenseModal';

const TripTypeLabels = {
  OneWay: 'One way',
  RoundTrip: 'Round trip',
};

const ExpenseCard = ({ expense, editToRoute, header }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { address = {}, expenseType, tripType } = expense;

  const deleteExpense = expenseId => {
    // TODO Add logic for this function, it will delete the expense once the delete modal is confirmed
    // eslint-disable-next-line no-console
    console.log(`Delete clicked for expense id: ${expenseId}`);
    setShowDeleteModal(false);
  };

  return (
    <>
      <va-card>
        <h3 className="vads-u-margin-top--1">{header}</h3>
        {expenseType === 'Mileage' && (
          <ExpenseCardDetails
            items={[
              {
                label: 'Which address did you depart from?',
                value: (
                  <>
                    {address.addressLine1}{' '}
                    {address.addressLine2 && (
                      <span>{address.addressLine2} </span>
                    )}
                    {address.addressLine3 && (
                      <span>{address.addressLine3} </span>
                    )}
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
            <Link
              data-testid={`${expense.id}-edit-expense-link`}
              className="active-va-link"
              to={editToRoute}
            >
              EDIT
              <va-icon
                active
                icon="navigate_next"
                size={3}
                aria-hidden="true"
              />
            </Link>
          </div>

          <va-button-icon
            className="align-items--end"
            data-action="remove"
            button-type="delete"
            onClick={() => setShowDeleteModal(true)}
          />
        </div>
      </va-card>
      <DeleteExpenseModal
        expenseCardTitle={header}
        expenseType={expenseType}
        visible={showDeleteModal}
        onCloseEvent={() => setShowDeleteModal(false)}
        onPrimaryButtonClick={() => deleteExpense(expense.id)}
        onSecondaryButtonClick={() => setShowDeleteModal(false)}
      />
    </>
  );
};

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
  editToRoute: PropTypes.string,
  header: PropTypes.string,
};

export default ExpenseCard;
