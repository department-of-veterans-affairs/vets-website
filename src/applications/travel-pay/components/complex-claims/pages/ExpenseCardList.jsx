import React from 'react';
import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { useDispatch, useSelector } from 'react-redux';
import { selectVAPResidentialAddress } from 'platform/user/selectors';

import ExpenseCard from './ExpenseCard';
import { getExpenseType } from '../../../util/complex-claims-helper';
import { setExpenseBackDestination } from '../../../redux/actions';

const ExpenseCardList = ({
  expensesList,
  type,
  showAddButton = false,
  showEditDelete = false,
  showHeader = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId } = useParams();
  const address = useSelector(selectVAPResidentialAddress);
  const expenseFields = getExpenseType(type);

  const onAddExpense = expenseRoute => {
    dispatch(setExpenseBackDestination('review'));
    navigate(`/file-new-claim/${apptId}/${claimId}/${expenseRoute}`);
  };

  return (
    <section key={type} className="vads-u-margin-bottom--3">
      {showHeader && (
        <h3 data-testid="expense-type-header">{expenseFields.title}</h3>
      )}

      {expensesList.map(expense => (
        <ExpenseCard
          key={expense.id}
          claimId={claimId}
          apptId={apptId}
          expense={expense}
          address={address}
          showEditDelete={showEditDelete}
        />
      ))}

      {showAddButton &&
        type !== 'Mileage' && (
          <VaButton
            id={`add-${type.toLowerCase()}-expense-button`}
            className="vads-u-display--flex vads-u-margin-y--2"
            text={`Add another ${expenseFields.addButtonText} expense`}
            secondary
            onClick={() => onAddExpense(expenseFields.route)}
          />
        )}
    </section>
  );
};

ExpenseCardList.propTypes = {
  expensesList: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  address: PropTypes.object,
  apptId: PropTypes.string,
  claimId: PropTypes.string,
  showAddButton: PropTypes.bool,
  showEditDelete: PropTypes.bool,
  showHeader: PropTypes.bool,
};

export default ExpenseCardList;
