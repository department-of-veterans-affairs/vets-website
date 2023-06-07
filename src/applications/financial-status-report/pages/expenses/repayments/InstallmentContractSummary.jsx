import React, { useEffect } from 'react';
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

const InstallmentContractSummary = ({
  data,
  goToPath,
  setFormData,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();

  const formData = useSelector(state => state.form.data);
  const { installmentContracts = [] } = formData;

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
      goToPath('/installment-contracts');
    },
  };

  const onDelete = deleteIndex => {
    dispatch(
      setFormData({
        ...formData,
        questions: {
          ...data.questions,
          hasRepayments: deleteIndex !== 0,
        },
        installmentContracts: installmentContracts.filter(
          (source, index) => index !== deleteIndex,
        ),
      }),
    );
  };
  const emptyPrompt = `Select the 'add additional installment contract link to add another installment contract or other debt. Select the continue button to move on to the next question.`;

  const billBody = bill => {
    return (
      <>
        <p>
          {bill.creditorName.length > 0 ? (
            <>
              Creditor: <strong>{bill.creditorName} </strong>
              <br />
            </>
          ) : null}
          Original Loan Amount:{' '}
          <strong>{currencyFormatter(bill.originalAmount)}</strong>
          <br />
          Unpaid balance:{' '}
          <strong>{currencyFormatter(bill.unpaidBalance)}</strong>
          <br />
          Minimum monthly payment amount:{' '}
          <strong>{currencyFormatter(bill.amountDueMonthly)}</strong>
          <br />
          Date received: <strong>{bill.dateStarted}</strong>
          <br />
          Amount overdue:{' '}
          <strong>{currencyFormatter(bill.amountPastDue)}</strong>
        </p>
      </>
    );
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          Your installment contracts and other debts
        </legend>
        <div className="vads-u-margin-top--3" data-testid="debt-list">
          {!installmentContracts.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            installmentContracts.map((bill, index) => (
              <MiniSummaryCard
                editDestination={{
                  pathname: '/your-installment-contracts',
                  search: `?index=${index}`,
                }}
                heading={bill.purpose}
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
            pathname: '/your-installment-contracts',
            search: `?index=${installmentContracts.length}`,
          }}
        >
          Add additional installment contract or other debt
        </Link>
        <va-additional-info
          class="vads-u-margin-top--4"
          trigger="What are examples of installment contracts or other debt?"
        >
          Examples of installment contracts or other debt include:
          <br />
          <ul>
            <li>Medical bills</li>
            <li>Student loans</li>
            <li>Auto loans</li>
            <li>Home loans</li>
            <li>Personal debts</li>
          </ul>
        </va-additional-info>
      </fieldset>
      {contentBeforeButtons}
      <FormNavButtons goBack={handlers.onBack} submitToContinue />
      {contentAfterButtons}{' '}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    setFormData: setData,
    formData: form.data,
    employmentHistory: form.data.personalData.employmentHistory,
  };
};

export default connect(mapStateToProps)(InstallmentContractSummary);
