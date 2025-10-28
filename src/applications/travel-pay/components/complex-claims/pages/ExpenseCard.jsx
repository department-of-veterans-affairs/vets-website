import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';

import { deleteExpense as deleteExpenseAction } from '../../../redux/actions';
import ExpenseCardDetails from './ExpenseCardDetails';
import DeleteExpenseModal from './DeleteExpenseModal';

const TripTypeLabels = {
  OneWay: 'One way',
  RoundTrip: 'Round trip',
};

const ExpenseCard = ({ apptId, claimId, expense, address }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();

  const { id: expenseId, expenseType, tripType } = expense;

  const header = `${expenseType} expense`;

  const deleteExpense = async () => {
    await dispatch(
      deleteExpenseAction(claimId, expenseType.toLowerCase(), expenseId),
    );
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
                    {address.addressLine1}
                    {address.addressLine2 && (
                      <span>{address.addressLine2}</span>
                    )}
                    {address.addressLine3 && (
                      <span>{address.addressLine3}</span>
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
              to={`/file-new-claim/${apptId}/${claimId}/${expenseType.toLowerCase()}/${expenseId}`}
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
        onPrimaryButtonClick={deleteExpense}
        onSecondaryButtonClick={() => setShowDeleteModal(false)}
      />
    </>
  );
};

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
  address: PropTypes.object,
  apptId: PropTypes.string,
  claimId: PropTypes.string,
};

export default ExpenseCard;
