import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';

import { deleteExpense as deleteExpenseAction } from '../../../redux/actions';
import { selectExpenseLoadingState } from '../../../redux/selectors';
import ExpenseCardDetails from './ExpenseCardDetails';
import DeleteExpenseModal from './DeleteExpenseModal';

const TripTypeLabels = {
  OneWay: 'One way',
  RoundTrip: 'Round trip',
};

const ExpenseCard = ({ apptId, claimId, expense, address }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const isDeleting = useSelector(selectExpenseLoadingState);

  const { id: expenseId, expenseType, tripType } = expense;

  const header = `${expenseType} expense`;

  const deleteExpense = async () => {
    setShowDeleteModal(false); // Close modal immediately
    await dispatch(
      deleteExpenseAction(claimId, expenseType.toLowerCase(), expenseId),
    );
  };

  return (
    <>
      <va-card>
        <h3 className="vads-u-margin-top--1">{header}</h3>
        {isDeleting ? (
          <div className="vads-u-margin-y--2">
            <va-loading-indicator
              message="Deleting expense..."
              set-focus="true"
            />
          </div>
        ) : (
          <>
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
          </>
        )}
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
