import PropTypes from 'prop-types';
import React from 'react';
import { useSelector, connect, useDispatch } from 'react-redux';
import { Link } from 'react-router';
import { setData } from '~/platform/forms-system/src/js/actions';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import {
  EmptyMiniSummaryCard,
  MiniSummaryCard,
} from '../shared/MiniSummaryCard';
import DeleteConfirmationModal from '../shared/DeleteConfirmationModal';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import {
  currency as currencyFormatter,
  firstLetterLowerCase,
  generateUniqueKey,
} from '../../utils/helpers';

export const keyFieldsForCreditCard = [
  'amountDueMonthly',
  'amountPastDue',
  'unpaidBalance',
];

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
      expenses: {
        ...expenses,
        creditCardBills: creditCardBills.filter(
          (_, index) => index !== deleteIndex,
        ),
      },
    });
  };

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
    deleteIndex,
  } = useDeleteModal(onDelete);

  const emptyPrompt = `Select the 'add additional credit card bill' link to add another bill. Select the continue button to move on to the next question.`;
  const billHeading = 'Credit card bill';

  const billBody = bill => {
    return (
      <>
        <p className="vads-u-margin--0">
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
          <h3 className="vads-u-margin--0">Your credit card bills</h3>
        </legend>
        <div className="vads-u-margin-top--3" data-testid="debt-list">
          {!creditCardBills.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            creditCardBills.map((bill, index) => (
              <MiniSummaryCard
                ariaLabel={`${billHeading} ${index + 1}`}
                editDestination={{
                  pathname: '/your-credit-card-bills',
                  search: `?index=${index}`,
                }}
                heading={`${billHeading} ${index + 1}`}
                key={generateUniqueKey(bill, keyFieldsForCreditCard, index)}
                onDelete={() => handleDeleteClick(index)}
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
        {contentAfterButtons}
        {isModalOpen ? (
          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={handleModalCancel}
            onDelete={handleModalConfirm}
            modalTitle={firstLetterLowerCase(
              `${billHeading} ${deleteIndex + 1}`,
            )}
          />
        ) : null}
      </fieldset>
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
