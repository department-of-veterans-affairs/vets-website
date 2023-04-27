import React, { useEffect } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../../../components/shared/MiniSummaryCard';

import { currency as currencyFormatter } from '../../../utils/helpers';

const CreditCardBillSummary = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);
  const { expenses } = formData;
  const { creditCardBills } = expenses || [];

  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      goToPath(`/other-expenses-checklist`);
    },
    onBack: event => {
      event.preventDefault();
      goToPath('/credit-card-bills');
    },
  };

  const onDelete = deleteIndex => {
    dispatch(
      setFormData({
        ...formData,
        questions: {
          ...data.questions,
          hasCreditCardBills: deleteIndex !== 0,
        },
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

  const billBody = bill => {
    return (
      <>
        <p>
          Unpaid balance:{' '}
          <strong>{currencyFormatter(bill.unpaidBalance)}</strong>
          <br />
          Minimum monthly payment amount:{' '}
          <strong>{currencyFormatter(bill.amountDueMonthly)}</strong>
          <br />
          Amount overdue:{' '}
          <strong>{currencyFormatter(bill.amountPastDue)}</strong>
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
              index={index}
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
      {contentBeforeButtons}
      <FormNavButtons goBack={handlers.onBack} submitToContinue />
      {contentAfterButtons}{' '}
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
