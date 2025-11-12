import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';

import { deleteExpense, deleteDocument } from '../../../redux/actions';
import { selectIsExpenseDeleting } from '../../../redux/selectors';
import { EXPENSE_TYPES, TRIP_TYPES } from '../../../constants';
import { formatDate } from '../../../util/dates';
import { currency } from '../../../util/string-helpers';
import ExpenseCardDetails from './ExpenseCardDetails';
import DeleteExpenseModal from './DeleteExpenseModal';

const ExpenseCard = ({ apptId, claimId, expense, address }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();

  const { id: expenseId, expenseType, documentId } = expense;
  const isDeleting = useSelector(state =>
    selectIsExpenseDeleting(state, expenseId),
  );

  const header = `${formatDate(expense.dateIncurred)}, ${currency(
    expense.costRequested,
  )}`;

  const handleDeleteExpenseAndDocument = async () => {
    setShowDeleteModal(false);
    dispatch(
      deleteExpense(claimId, EXPENSE_TYPES[expenseType]?.apiRoute, expenseId),
    );
    if (documentId !== '') {
      dispatch(deleteDocument(claimId, documentId));
    }
  };

  return (
    <div className="vads-u-margin-top--2">
      <va-card>
        <h3 className="vads-u-margin-top--1">{header}</h3>
        {isDeleting ? (
          <div className="vads-u-text-align--center vads-u-margin--5">
            <va-loading-indicator message="Deleting..." set-focus={false} />
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
                    value: TRIP_TYPES.ROUND_TRIP.label,
                  },
                ]}
              />
            )}
            {expenseType !== 'Mileage' && (
              <ExpenseCardDetails
                items={[
                  {
                    label: 'Description',
                    value: expense.description,
                  },
                  {
                    label: 'File name',
                    value: expense.document?.filename,
                  },
                ]}
              />
            )}
            <div className="review-button-row">
              <div className="review-edit-button">
                <Link
                  data-testid={`${expenseId}-edit-expense-link`}
                  to={`/file-new-claim/${apptId}/${claimId}/${
                    EXPENSE_TYPES[expenseType]?.route
                  }/${expenseId}`}
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
                disabled={isDeleting}
                onClick={() => !isDeleting && setShowDeleteModal(true)}
              />
            </div>
          </>
        )}
      </va-card>
      <DeleteExpenseModal
        expenseCardTitle={header}
        expenseType={expenseType}
        visible={showDeleteModal && !isDeleting}
        onCloseEvent={() => setShowDeleteModal(false)}
        onPrimaryButtonClick={handleDeleteExpenseAndDocument}
        onSecondaryButtonClick={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
  address: PropTypes.object,
  apptId: PropTypes.string,
  claimId: PropTypes.string,
};

export default ExpenseCard;
