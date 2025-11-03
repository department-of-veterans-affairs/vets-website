import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom-v5-compat';

import { deleteExpense } from '../../../redux/actions';
import { selectIsExpenseDeleting } from '../../../redux/selectors';
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
  const isDeleting = useSelector(state =>
    selectIsExpenseDeleting(state, expenseId),
  );

  const header = `${expenseType} expense`;

  const handleDeleteExpense = async () => {
    setShowDeleteModal(false);
    dispatch(deleteExpense(claimId, expenseType.toLowerCase(), expenseId));
  };

  return (
    <div className="vads-u-margin-top--2">
      <va-card>
        <h3 className="vads-u-margin-top--1">{header}</h3>
        {isDeleting && (
          <va-loading-indicator
            class="vads-u-margin-left--2 vads-u-display--inline-block"
            message="Deleting..."
            set-focus={false}
          />
        )}
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
            disabled={isDeleting}
            onClick={() => !isDeleting && setShowDeleteModal(true)}
          />
        </div>
      </va-card>
      <DeleteExpenseModal
        expenseCardTitle={header}
        expenseType={expenseType}
        visible={showDeleteModal && !isDeleting}
        onCloseEvent={() => setShowDeleteModal(false)}
        onPrimaryButtonClick={handleDeleteExpense}
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
