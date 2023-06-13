import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { setData } from 'platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import { clearJobIndex } from '../../../utils/session';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../../../components/shared/MiniSummaryCard';

import { currency as currencyFormatter } from '../../../utils/helpers';

const CreditCardBillSummary = ({
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const setFormData = newData => dispatch(setData(newData));
  const formData = useSelector(state => state.form.data);
  const { expenses } = formData;
  const { creditCardBills } = expenses || [];

  useEffect(() => {
    clearJobIndex();
  }, []);

  const handlers = {
    onSubmit: event => {
      event.preventDefault();
      goToPath(`/installment-contracts`);
    },
    onBack: event => {
      event.preventDefault();
      goToPath('/credit-card-bills');
    },
  };

  const onDelete = deleteIndex => {
    setFormData({
      ...formData,
      // questions: {
      //   ...data.questions,
      //   hasCreditCardBills: deleteIndex !== 0,
      // },
      expenses: {
        ...expenses,
        creditCardBills: creditCardBills.filter(
          (_, index) => index !== deleteIndex,
        ),
      },
    });
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
          <strong>{currencyFormatter(bill.amountPastDue || 0.0)}</strong>
        </p>
      </>
    );
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          Your credit card bills
        </legend>
        <div className="vads-u-margin-top--3" data-testid="debt-list">
          {!creditCardBills.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            creditCardBills.map((bill, index) => (
              <MiniSummaryCard
                ariaLabel={`Credit card bill ${index + 1}`}
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
      </fieldset>
      {contentBeforeButtons}
      <FormNavButtons goBack={handlers.onBack} submitToContinue />
      {contentAfterButtons}{' '}
    </form>
  );
};

const mapStateToProps = ({ form }) => {
  return {
    formData: form.data,
  };
};

CreditCardBillSummary.propTypes = {
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default connect(mapStateToProps)(CreditCardBillSummary);
