import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom-v5-compat';
import {
  VaModal,
  VaButton,
  VaButtonPair,
  VaDate,
  VaTextInput,
  VaRadio,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import {
  EXPENSE_TYPES,
  TRANSPORTATION_OPTIONS,
  TRANSPORTATION_REASONS,
} from '../../../constants';

const ExpensePage = () => {
  const navigate = useNavigate();
  const { apptId, expenseTypeRoute } = useParams();
  const [transportationType, setTransportationType] = useState('');
  const [transportationReason, setTransportationReason] = useState('');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const expenseType = Object.keys(EXPENSE_TYPES).find(
    key => EXPENSE_TYPES[key].route === expenseTypeRoute,
  );

  const expenseTypeFields = expenseType ? EXPENSE_TYPES[expenseType] : null;

  const handleTransportationTypeChange = event => {
    setTransportationType(event.detail.value);
  };

  const handleTransportationReasonChange = event => {
    setTransportationReason(event.detail.value);
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleContinue = () => {
    navigate(`/file-new-claim/complex/${apptId}/review`);
  };

  const handleBack = () => {
    navigate(`/file-new-claim/complex/${apptId}/choose-expense`);
  };

  return (
    <>
      <h1>{expenseTypeFields?.title || 'Unknown expense'}</h1>
      <p>
        {`If you have multiple ${expenseTypeFields.title.toLowerCase()} expenses, add just one on this page. ` +
          `You'll be able to add more expenses after this.`}
      </p>
      <VaDate label="Date" name="date" required />
      <VaTextInput
        currency
        label="Amount requested"
        name="amount"
        required
        show-input-error
        hint="Enter the amount as dollars and cents. For example, 8.42"
      />
      <VaTextInput label="Description" name="description" required />
      {expenseType === 'Commoncarrier' && (
        <>
          <VaRadio
            id="transportation-type"
            onVaValueChange={handleTransportationTypeChange}
            value={transportationType}
            label="Type of transportation"
            required
          >
            {TRANSPORTATION_OPTIONS.map(option => (
              <va-radio-option
                key={option}
                label={option}
                value={option}
                name={`transportation-type-${option}`}
                checked={transportationType === option}
              />
            ))}
          </VaRadio>
          <VaRadio
            id="transportation-reasons"
            onVaValueChange={handleTransportationReasonChange}
            value={transportationReason}
            label="Why did you choose to use public transportation?"
            required
          >
            {Object.keys(TRANSPORTATION_REASONS).map(key => (
              <va-radio-option
                key={key}
                label={TRANSPORTATION_REASONS[key].label}
                value={key}
                name={`transportation-reason-${key}`}
                checked={transportationReason === key}
              />
            ))}
          </VaRadio>
        </>
      )}
      <VaModal
        modalTitle="Cancel adding this expense"
        onCloseEvent={handleCloseModal}
        onPrimaryButtonClick={handleCloseModal}
        onSecondaryButtonClick={handleCloseModal}
        primaryButtonText="Yes, cancel"
        secondaryButtonText="No, continue adding this expense"
        status="warning"
        visible={isModalVisible}
      >
        <p>
          If you cancel, you’ll lose the information you entered about this
          expense and will be returned to the review page.
        </p>
      </VaModal>
      <VaButton
        secondary
        text="Cancel adding this expense"
        onClick={handleOpenModal}
        className="vads-u-display--flex vads-u-margin-y--2 travel-pay-complex-expense-cancel-btn"
      />
      <VaButtonPair
        class="vads-u-margin-y--2"
        continue
        disable-analytics
        onPrimaryClick={handleContinue}
        onSecondaryClick={handleBack}
      />
    </>
  );
};

export default ExpensePage;
