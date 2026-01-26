import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';

import {
  setReviewPageAlert,
  deleteExpenseDeleteDocument,
  clearReviewPageAlert,
} from '../../../redux/actions';
import { selectIsExpenseDeleting } from '../../../redux/selectors';
import { EXPENSE_TYPES, EXPENSE_TYPE_KEYS } from '../../../constants';
import { formatDate } from '../../../util/dates';
import { currency } from '../../../util/string-helpers';
import ExpenseCardDetails from './ExpenseCardDetails';
import DeleteExpenseModal from './DeleteExpenseModal';

const ExpenseCard = ({ apptId, claimId, expense, address, showEditDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useDispatch();

  const { id: expenseId, expenseType, documentId } = expense;
  const isDeleting = useSelector(state =>
    selectIsExpenseDeleting(state, expenseId),
  );
  const isMileage = expenseType === EXPENSE_TYPE_KEYS.MILEAGE;

  const header = isMileage
    ? 'Mileage expense'
    : `${formatDate(expense.dateIncurred)}, ${currency(expense.costRequested)}`;

  const handleDeleteExpenseAndDocument = async () => {
    setShowDeleteModal(false);

    try {
      // This action deletes the expense first, then the document.
      // If any step fails, it throws an error and nothing else runs.
      await dispatch(
        deleteExpenseDeleteDocument(
          claimId,
          documentId,
          EXPENSE_TYPES[expenseType]?.apiRoute,
          expenseId,
        ),
      );
      // Clear any existing alerts after successful deletion
      dispatch(clearReviewPageAlert());
    } catch (error) {
      // Any error from deleting either the expense or document ends up here
      dispatch(
        setReviewPageAlert({
          title: `We couldn't delete this expense right now`,
          description: `We're sorry. We can't delete this expense. Try again later.`,
          type: 'error',
        }),
      );
    }
  };

  return (
    <div className="vads-u-margin-top--2">
      <va-card
        className="expense-card"
        data-testid={`expense-card-${expense.id}`}
      >
        <h4 className="vads-u-margin-top--1">{header}</h4>
        {isDeleting ? (
          <div className="vads-u-text-align--center vads-u-margin--5">
            <va-loading-indicator message="Deleting..." set-focus={false} />
          </div>
        ) : (
          <>
            {isMileage && (
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
                ]}
              />
            )}
            {!isMileage && (
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
            {showEditDelete && (
              <div className="review-button-row">
                <div className="review-edit-button">
                  <Link
                    data-testid={`${expenseId}-edit-expense-link`}
                    to={`/file-new-claim/${apptId}/${claimId}/${
                      EXPENSE_TYPES[expenseType]?.route
                    }/${expenseId}`}
                  >
                    Edit
                    <va-icon
                      active
                      icon="navigate_next"
                      size={3}
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                <va-button-icon
                  data-testid={`${expenseId}-delete-expense-button`}
                  className="align-items--end"
                  data-action="remove"
                  button-type="delete"
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>
            )}
          </>
        )}
      </va-card>
      {showEditDelete && (
        <DeleteExpenseModal
          expenseCardTitle={header}
          expenseType={expenseType}
          visible={showDeleteModal}
          onCloseEvent={() => setShowDeleteModal(false)}
          onPrimaryButtonClick={handleDeleteExpenseAndDocument}
          onSecondaryButtonClick={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

ExpenseCard.propTypes = {
  expense: PropTypes.object.isRequired,
  address: PropTypes.object,
  apptId: PropTypes.string,
  claimId: PropTypes.string,
  showEditDelete: PropTypes.bool,
};

export default ExpenseCard;
