import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import ReviewPageAlert from './ReviewPageAlert';
import MileageExpenseCard from './MileageExpenseCard';

const ReviewPage = ({ claim, message, onNext }) => {
  // For now, we will override the claim to have some expenses
  // If message is not provided, use default values
  const overriddenClaim = claim || [
    {
      claimId: '12345',
      claimNumber: '12345',
      appointmentDate: '2025-10-01',
      facilityName: 'Cheyenne VA Medical Center',
      totalCostRequested: 130.0,
      reimbursementAmount: 0,
      createdOn: '2025-10-04',
      modifiedOn: '2025-10-04',
      appointment: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        appointmentSource: 'API',
        appointmentDateTime: '2025-10-17T21:32:16.531Z',
        appointmentName: 'string',
        appointmentType: 'EnvironmentalHealth',
        facilityId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        facilityName: 'Cheyenne VA Medical Center',
        serviceConnectedDisability: 0,
        currentStatus: 'Pending',
        appointmentStatus: 'Complete',
        externalAppointmentId: '12345',
        associatedClaimId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        associatedClaimNumber: '',
        isCompleted: true,
      },
      rejectionReason: {
        rejectionReasonId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        rejectionReasonName: '',
        rejectionReasonTitle: '',
        rejectionReasonDescription: '',
      },
      expenses: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          expenseType: 'Mileage',
          name: 'string',
          dateIncurred: '2025-10-17T21:32:16.531Z',
          description: 'string',
          costRequested: 100,
          costSubmitted: 0,
          tripType: 'OneWay',
          requestedMileage: 100,
          challengeMileage: false,
          challengeRequestedMileage: 0,
          challengeReason: '',
          address: {
            addressLine1: '345 Home Address St.',
            addressLine2: 'Apt. 123',
            addressLine3: '#67',
            city: 'San Francisco',
            countryName: 'United States',
            stateCode: 'CA',
            zipCode: '94118',
          },
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          expenseType: 'Parking',
          name: 'string',
          dateIncurred: '2025-10-17T21:32:16.531Z',
          description: 'string',
          costRequested: 10,
          costSubmitted: 0,
        },
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
          expenseType: 'Parking',
          name: 'string',
          dateIncurred: '2025-10-18T21:32:16.531Z',
          description: 'string',
          costRequested: 20,
          costSubmitted: 0,
        },
      ],
    },
  ];

  // Create a grouped version of expenses by expenseType
  const groupedExpenses = overriddenClaim[0].expenses.reduce((acc, expense) => {
    const { expenseType } = expense;
    if (!acc[expenseType]) {
      acc[expenseType] = [];
    }
    acc[expenseType].push(expense);
    return acc;
  }, {});

  // For now, we will override the message to have a title, body, and type
  // If message is not provided, use default values
  const overriddenMessage = message || {
    title: '',
    body: 'Your mileage expense was successfully added.',
    type: 'success',
  };

  const [visible, setVisible] = useState(true);
  const onClose = () => setVisible(false);
  const addMoreExpenses = () => {
    // TODO Add logic to add more expenses
  };

  const signAgreement = () => {
    // TODO Add logic to sign the agreement
    onNext();
  };

  return (
    <>
      <h1>Your unsubmitted expenses</h1>
      <ReviewPageAlert
        header={overriddenMessage.title}
        description={overriddenMessage.body}
        status={overriddenMessage.type}
        onCloseEvent={onClose}
        visible={visible}
      />
      <VaButton
        id="add-expense-button"
        className="vads-u-display--flex vads-u-margin-y--2"
        text="Add more expenses"
        onClick={addMoreExpenses}
      />
      <p>The expenses you’ve added are listed here.</p>
      <va-accordion>
        {Object.entries(groupedExpenses).map(([type, expenses]) => (
          <va-accordion-item key={type} header={`${type} (${expenses.length})`}>
            {expenses.map(expense => (
              <div key={expense.id}>
                {expense.expenseType === 'Mileage' && (
                  <MileageExpenseCard expense={expense} />
                )}
              </div>
            ))}
          </va-accordion-item>
        ))}
      </va-accordion>
      <VaButton
        id="sign-agreement-button"
        className="vads-u-display--flex vads-u-margin-y--2"
        text="Sign agreement"
        onClick={signAgreement}
      />
    </>
  );
};

ReviewPage.propTypes = {
  claim: PropTypes.arrayOf(PropTypes.object),
  message: PropTypes.shape({
    title: PropTypes.string,
    body: PropTypes.string,
    type: PropTypes.string,
  }),
  onNext: PropTypes.func,
};

export default ReviewPage;
