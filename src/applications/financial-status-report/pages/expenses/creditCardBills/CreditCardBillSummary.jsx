import React, { useEffect, useState } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { setData } from 'platform/forms-system/src/js/actions';
import { Link } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../../../components/shared/MiniSummaryCard';

import { currency as currencyFormatter } from '../../../utils/helpers';

const CreditCardBillSummary = props => {
  const dispatch = useDispatch();

  const { goToPath, goBack, onReviewPage } = props;
  const [hasAdditionalVehicleToAdd, setHasAdditionalVehicleoAdd] = useState(
    'false',
  );

  const formData = useSelector(state => state.form.data);
  const { expenses } = formData;
  const { creditCardBills } = expenses || [];

  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      if (hasAdditionalVehicleToAdd === 'true') {
        goToPath(`/your-credit-card-bills`);
      } else {
        goToPath(`/other-expenses`);
      }
    },
    onSelection: event => {
      const { value } = event?.detail || {};
      if (value) {
        setHasAdditionalVehicleoAdd(value);
      }
    },
  };

  const onDelete = deleteIndex => {
    dispatch(
      setData({
        ...formData,
        expenses: {
          ...expenses,
          creditCardBills: creditCardBills.filter(
            (source, index) => index !== deleteIndex,
          ),
        },
      }),
    );
  };
  const emptyPrompt = `Select the 'add additional credit card bill' link to add another bill. Select the continue button to move on to the next question.`;

  const navButtons = <FormNavButtons goBack={goBack} submitToContinue />;
  const updateButton = <button type="submit">Review update button</button>;

  const billBody = bill => {
    return (
      <>
        <p>
          Unpaid balance:{' '}
          <strong>{currencyFormatter(bill.unpaidBalance)}</strong>
          <br />
          Minimum monthly payment amount:{' '}
          <strong>{currencyFormatter(bill.minMonthlyPayment)}</strong>
          <br />
          Amount overdue:{' '}
          <strong>{currencyFormatter(bill.amountOverdue)}</strong>
        </p>
      </>
    );
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <div className="vads-u-margin-top--3" data-testid="debt-list">
        {!creditCardBills.length ? (
          <EmptyMiniSummaryCard content={emptyPrompt} />
        ) : (
          creditCardBills.map((bill, index) => (
            <MiniSummaryCard
              editDestination={{
                pathname: '/your-credit-card-bills',
                search: `?index=${index}`,
              }}
              heading="Credit card bill"
              key={bill.minPaymentAmount + bill.unpaidBalance}
              onDelete={() => onDelete(index)}
              showDelete
              body={billBody(bill)}
            />
          ))
        )}
      </div>
      <Link
        className="vads-c-action-link--green"
        to={{
          pathname: '/your-credit-card-bills',
          search: `?index=${creditCardBills.length}`,
        }}
      >
        Add additional credit card bill
      </Link>
      {onReviewPage ? updateButton : navButtons}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

export default connect(mapStateToProps)(CreditCardBillSummary);
