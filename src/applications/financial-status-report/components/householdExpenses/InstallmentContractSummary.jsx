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

export const keyFieldsForInstallmentContract = [
  'creditorName',
  'amountDueMonthly',
  'amountPastDue',
  'unpaidBalance',
];

const InstallmentContractSummary = ({
  goToPath,
  contentBeforeButtons,
  contentAfterButtons,
}) => {
  const dispatch = useDispatch();
  const setFormData = newData => dispatch(setData(newData));
  const formData = useSelector(state => state.form.data);
  const { installmentContracts = [] } = formData;

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
    setFormData({
      ...formData,
      installmentContracts: installmentContracts.filter(
        (_, index) => index !== deleteIndex,
      ),
    });
  };

  const {
    isModalOpen,
    handleModalCancel,
    handleModalConfirm,
    handleDeleteClick,
    deleteIndex,
  } = useDeleteModal(onDelete);

  const emptyPrompt = `Select the 'add additional installment contract link to add another installment contract or other debt. Select the continue button to move on to the next question.`;

  const reformattedDateReceived = dateReceived => {
    const dateYear = dateReceived.split('-')[0];
    const dateMonth = dateReceived.split('-')[1];

    return `${dateMonth}/XX/${dateYear}`;
  };

  const billBody = ({
    creditorName,
    originalAmount,
    unpaidBalance,
    amountDueMonthly,
    dateStarted,
    amountPastDue,
  }) => {
    const formattedFields = {
      Creditor: creditorName,
      'Original Loan Amount': originalAmount
        ? currencyFormatter(originalAmount)
        : null,
      'Unpaid balance': unpaidBalance ? currencyFormatter(unpaidBalance) : null,
      'Minimum monthly payment amount': amountDueMonthly
        ? currencyFormatter(amountDueMonthly)
        : null,
      'Date received': reformattedDateReceived(dateStarted),
      'Amount overdue': amountPastDue
        ? currencyFormatter(amountPastDue)
        : currencyFormatter(0.0),
    };

    return (
      <p className="vads-u-margin--0">
        {Object.entries(formattedFields).map(
          ([key, value]) =>
            value ? (
              <React.Fragment key={key}>
                <strong>{key}:</strong> {value}
                <br />
              </React.Fragment>
            ) : null,
        )}
      </p>
    );
  };

  return (
    <form onSubmit={handlers.onSubmit}>
      <fieldset className="vads-u-margin-y--2">
        <legend className="schemaform-block-title">
          <h3 className="vads-u-margin--0">
            Your installment contracts and other debts
          </h3>
        </legend>
        <div className="vads-u-margin-top--3" data-testid="debt-list">
          {!installmentContracts.length ? (
            <EmptyMiniSummaryCard content={emptyPrompt} />
          ) : (
            installmentContracts.map((bill, index) => (
              <MiniSummaryCard
                ariaLabel={`Installment contract ${index + 1} ${bill.purpose}`}
                editDestination={{
                  pathname: '/your-installment-contracts',
                  search: `?index=${index}`,
                }}
                heading={bill.purpose}
                key={generateUniqueKey(
                  bill,
                  keyFieldsForInstallmentContract,
                  index,
                )}
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
            pathname: '/your-installment-contracts',
            search: `?index=${installmentContracts.length}`,
          }}
        >
          Add additional installment contract or other debt
        </Link>
        <va-additional-info
          class="vads-u-margin-top--4"
          trigger="What are examples of installment contracts or other debt?"
          uswds
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
        {contentBeforeButtons}
        <FormNavButtons goBack={handlers.onBack} submitToContinue />
        {contentAfterButtons}
        {isModalOpen ? (
          <DeleteConfirmationModal
            isOpen={isModalOpen}
            onClose={handleModalCancel}
            onDelete={handleModalConfirm}
            modalTitle={firstLetterLowerCase(
              installmentContracts[deleteIndex]?.purpose,
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

InstallmentContractSummary.propTypes = {
  goToPath: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
  contentAfterButtons: PropTypes.node,
  contentBeforeButtons: PropTypes.node,
};

export default connect(mapStateToProps)(InstallmentContractSummary);
