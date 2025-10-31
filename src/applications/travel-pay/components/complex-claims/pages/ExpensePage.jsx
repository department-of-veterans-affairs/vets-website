import React, { useState, useRef, useEffect } from 'react';
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
  TRIP_OPTIONS,
} from '../../../constants';

const ExpensePage = () => {
  const navigate = useNavigate();
  const { apptId, expenseTypeRoute } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formState, setFormState] = useState({});
  const [showError, setShowError] = useState(false);
  const errorRef = useRef(null); // ref for the error message

  // Focus the error message when it becomes visible
  useEffect(
    () => {
      if (showError && errorRef.current) {
        errorRef.current.focus();
      }
    },
    [showError],
  );

  const expenseType = Object.keys(EXPENSE_TYPES).find(
    key => EXPENSE_TYPES[key].route === expenseTypeRoute,
  );

  const expenseTypeFields = expenseType ? EXPENSE_TYPES[expenseType] : null;

  const handleFormChange = (event, explicitName) => {
    // Figure out the field name
    const name = explicitName ?? event.target?.name ?? event.detail?.name; // rarely used, but safe to include

    // Figure out the value (covers VA components + normal inputs)
    const value =
      event?.value ?? event?.detail?.value ?? event.target?.value ?? '';

    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  const validatePage = () => {
    const requiredFields = ['date', 'amount']; // basic required fields

    if (expenseType === 'Meal') requiredFields.push('vendor');
    if (expenseType === 'Lodging') {
      requiredFields.push('vendor', 'checkInDate', 'checkOutDate');
    }
    if (expenseType === 'Commoncarrier') {
      requiredFields.push('transportationType', 'transportationReason');
    }
    if (expenseType === 'Airtravel') {
      requiredFields.push(
        'vendorName',
        'tripType',
        'departureDate',
        'departureAirport',
        'arrivalDate',
        'arrivalAirport',
      );
    }

    const emptyFields = requiredFields.filter(field => !formState[field]);
    if (emptyFields.length > 0) {
      setShowError(true);
      return; // stop navigation
    }

    setShowError(false);
  };

  const handleContinue = () => {
    validatePage();
    navigate(`/file-new-claim/complex/${apptId}/review`);
  };

  const handleBack = () => {
    navigate(`/file-new-claim/complex/${apptId}/choose-expense`);
  };

  return (
    <>
      <h1>
        {' '}
        {expenseTypeFields?.expensePageText
          ? `${expenseTypeFields.expensePageText
              .charAt(0)
              .toUpperCase()}${expenseTypeFields.expensePageText.slice(
              1,
            )} expense`
          : 'Unknown expense'}
      </h1>
      {showError && (
        <p
          ref={errorRef}
          tabIndex={-1} // make focusable
          style={{ color: 'red' }}
        >
          Please fill out all required fields before continuing.
        </p>
      )}
      <p>
        {`If you have multiple ${
          expenseTypeFields.expensePageText
        } expenses, add just one on this page. ` +
          `You'll be able to add more expenses after this.`}
      </p>
      {expenseType === 'Meal' && (
        <>
          <VaTextInput
            label="Where did you purchase the meal?"
            name="vendor"
            value={formState.vendor || ''}
            required
            onInput={handleFormChange}
            error
          />
        </>
      )}
      {expenseType === 'Lodging' && (
        <>
          <VaTextInput
            label="Where did you stay?"
            name="vendor"
            value={formState.vendor || ''}
            required
            onInput={handleFormChange}
          />
          <VaDate
            label="Check in date"
            name="checkInDate"
            value={formState.checkInDate || ''}
            required
            onDateChange={handleFormChange}
          />
          <VaDate
            label="Check out date"
            name="checkOutDate"
            value={formState.checkOutDate || ''}
            required
            onDateChange={handleFormChange}
          />
        </>
      )}
      {expenseType === 'Commoncarrier' && (
        <>
          <VaRadio
            id="transportation-type"
            name="transportationType"
            value={formState.transportationType || ''}
            onVaValueChange={e =>
              handleFormChange(e.detail, 'transportationType')
            }
            label="Type of transportation"
            required
          >
            {TRANSPORTATION_OPTIONS.map(option => (
              <va-radio-option
                key={option}
                label={option}
                value={option}
                name={`transportation-type-${option}`}
                checked={formState.transportationType === option}
              />
            ))}
          </VaRadio>
          <VaRadio
            id="transportation-reasons"
            name="transportationReasons"
            onVaValueChange={e =>
              handleFormChange(e.detail, 'transportationReasons')
            }
            value={formState.transportationReason || ''}
            label="Why did you choose to use public transportation?"
            required
          >
            {Object.keys(TRANSPORTATION_REASONS).map(key => (
              <va-radio-option
                key={key}
                label={TRANSPORTATION_REASONS[key].label}
                value={key}
                name={`transportation-reason-${key}`}
                checked={formState.transportationReason === key}
              />
            ))}
          </VaRadio>
        </>
      )}
      {expenseType === 'Airtravel' && (
        <>
          <VaTextInput
            label="Where did you purchase your ticket?"
            name="vendorName"
            value={formState.vendorName || ''}
            required
            onInput={handleFormChange}
            hint="If you didn’t purchase the ticket(s) directly from an airline, enter the company you purchased the ticket from."
          />
          <VaRadio
            id="trip-type"
            name="tripType"
            value={formState.tripType || ''}
            label="Type of trip"
            onVaValueChange={e => handleFormChange(e.detail, 'tripType')}
            required
          >
            {TRIP_OPTIONS.map(option => (
              <va-radio-option
                key={option}
                label={option}
                value={option}
                name={`trip-type-${option}`}
                checked={formState.tripType === option}
              />
            ))}
          </VaRadio>
          <VaDate
            label="Departure date"
            name="departureDate"
            value={formState.departureDate || ''}
            required
            onDateChange={handleFormChange}
            hint="For round trip flights, enter the departure date of your first flight."
          />
          <VaTextInput
            label="Departure airport"
            name="departureAirport"
            value={formState.departureAirport || ''}
            required
            onInput={handleFormChange}
            hint="For round trip flights, enter the departure airport of your first flight."
          />
          <VaDate
            label="Arrival date"
            name="arrivalDate"
            value={formState.arrivalDate || ''}
            required
            onDateChange={handleFormChange}
          />
          <VaTextInput
            label="Arrival airport"
            name="arrivalAirport"
            value={formState.arrivalAirport || ''}
            required
            onInput={handleFormChange}
          />
        </>
      )}
      <VaDate
        label="Date"
        name="date"
        value={formState.date || ''}
        required
        onDateChange={handleFormChange}
      />
      <VaTextInput
        currency
        label="Amount requested"
        name="amount"
        value={formState.amount || ''}
        required
        show-input-error
        onInput={handleFormChange}
        hint="Enter the amount as dollars and cents. For example, 8.42"
      />
      <VaTextInput
        label="Description"
        name="description"
        value={formState.description || ''}
        onInput={handleFormChange}
      />
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
