import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import { useSelector, useDispatch } from 'react-redux';
import {
  VaRadio,
  VaButtonPair,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import useSetPageTitle from '../../../hooks/useSetPageTitle';
import useSetFocus from '../../../hooks/useSetFocus';
import { EXPENSE_TYPES, EXPENSE_TYPE_KEYS } from '../../../constants';
import {
  selectComplexClaim,
  selectExpenseBackDestination,
} from '../../../redux/selectors';
import { setExpenseBackDestination } from '../../../redux/actions';

const ChooseExpenseType = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { apptId, claimId } = useParams();
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [showError, setShowError] = useState(false);
  const [mileageError, setMileageError] = useState(false);

  // Get claim data
  const { data: claim } = useSelector(selectComplexClaim);

  const backDestination = useSelector(selectExpenseBackDestination);

  const title = 'What type of expense do you want to add?';

  useSetPageTitle(title);
  useSetFocus();

  // Check if claim already has a mileage expense
  const hasExistingMileageExpense = () => {
    if (!claim || !claim.expenses) return false;
    return claim.expenses.some(
      expense =>
        expense.expenseType === EXPENSE_TYPES[EXPENSE_TYPE_KEYS.MILEAGE].title,
    );
  };

  // Convert EXPENSE_TYPES object into an array for mapping
  const expenseOptions = Object.values(EXPENSE_TYPES);

  const handleContinue = () => {
    // Check for existing mileage expense
    if (
      selectedExpenseType === EXPENSE_TYPES[EXPENSE_TYPE_KEYS.MILEAGE].route &&
      hasExistingMileageExpense()
    ) {
      setMileageError(true);
      setShowError(false);
      return;
    }
    if (!selectedExpenseType) {
      setShowError(true);
      setMileageError(false);
      return;
    }

    setShowError(false);
    setMileageError(false);
    // Navigate to the route defined in the constant
    const selectedExpense = expenseOptions.find(
      e => e.route === selectedExpenseType,
    );

    if (selectedExpense) {
      // Set back destination so expense page knows to return to choose-expense
      dispatch(setExpenseBackDestination('choose-expense'));
      navigate(`/file-new-claim/${apptId}/${claimId}/${selectedExpense.route}`);
    }
  };

  const handleBack = () => {
    if (backDestination === 'review') {
      navigate(`/file-new-claim/${apptId}/${claimId}/review`);
    } else {
      navigate(`/file-new-claim/${apptId}`, { state: { skipRedirect: true } });
    }
  };

  const hintText = 'You can submit 1 mileage expense for this claim.';

  const errorMessage = mileageError
    ? 'You can only add 1 mileage expense for each claim. Select another expense type or submit your claim.'
    : 'Select an expense type';

  return (
    <>
      <h1 className="vads-u-margin-bottom--2">{title}</h1>
      <p>Select 1 expense. You’ll be able to add other expenses later.</p>
      <p className="vads-u-margin-bottom--0">
        We’ll need to pre-approve any lodging or meals before you request
        reimbursement.
      </p>
      <VaRadio
        label="Select an expense type"
        required
        enableAnalytics
        class="vads-u-margin-top--2"
        error={showError || mileageError ? errorMessage : null}
        onVaValueChange={event => {
          setSelectedExpenseType(event.detail.value);
          if (showError) setShowError(false);
          if (mileageError) setMileageError(false);
        }}
      >
        {expenseOptions.map(option => (
          <va-radio-option
            tile
            key={option.route}
            label={option.title}
            name="choose-expense-type"
            value={option.route}
            description={
              option.name === EXPENSE_TYPES.Mileage.name ? hintText : ''
            }
            checked={selectedExpenseType === option.route}
          />
        ))}
      </VaRadio>

      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
      />
    </>
  );
};

export default ChooseExpenseType;
