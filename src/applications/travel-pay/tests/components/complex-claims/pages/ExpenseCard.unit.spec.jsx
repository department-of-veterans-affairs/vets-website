import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import ExpenseCard from '../../../../components/complex-claims/pages/ExpenseCard';
import reducer from '../../../../redux/reducer';

describe('ExpenseCard', () => {
  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const defaultMileageExpense = {
    id: 'expense1',
    address: {
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressLine3: '',
      city: 'Washington',
      stateCode: 'DC',
      zipCode: '20001',
    },
    tripType: 'RoundTrip',
    expenseType: 'Mileage',
    dateIncurred: '2023-10-15',
    costRequested: 25.5,
  };

  const defaultNonMileageExpense = {
    id: 'expense2',
    expenseType: 'Parking',
    description: 'Parking at hospital',
    document: { filename: 'test.pdf' },
    dateIncurred: '2023-10-15',
    costRequested: 15,
  };

  const getData = () => ({
    travelPay: {
      complexClaim: {
        expenses: {
          delete: {
            isLoading: false,
            error: null,
            id: '',
          },
        },
      },
    },
  });

  // Helper to render the component with router + store
  const renderExpenseCard = (expense = defaultMileageExpense) =>
    renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/review']}>
        <ExpenseCard
          expense={expense}
          address={expense.address}
          apptId="test-appt-id"
          claimId="test-claim-id"
        />
      </MemoryRouter>,
      { initialState: getData(), reducers: reducer },
    );

  it('renders mileage component correctly', () => {
    const { getByText, container } = renderExpenseCard();

    // Header
    expect(getByText('October 15, 2023, $25.50')).to.exist;

    // Address
    expect(getByText('Which address did you depart from?')).to.exist;
    expect(container.textContent).to.include('123 Main St');
    expect(container.textContent).to.include('Apt 4B');
    expect(container.textContent).to.include('Washington, DC 20001');

    // Trip type
    expect(getByText('Was your trip round trip or one way?')).to.exist;
    expect(container.textContent).to.include('Round trip');

    // Edit button
    const editLink = container.querySelector('a');
    expect(editLink).to.exist;
    expect(editLink.textContent).to.include('EDIT');

    // Delete button exists
    const deleteButton = container.querySelector('va-button-icon');
    expect(deleteButton).to.exist;
    expect(deleteButton.getAttribute('button-type')).to.equal('delete');
  });

  it('renders non-mileage expense correctly', () => {
    const { getByText } = renderExpenseCard(defaultNonMileageExpense);

    expect(getByText('October 15, 2023, $15.00')).to.exist;
    expect(getByText('Description')).to.exist;
    expect(getByText('Parking at hospital')).to.exist;
    expect(getByText('File name')).to.exist;
    expect(getByText('test.pdf')).to.exist;
  });

  it('renders correctly with empty address lines', () => {
    const expense = {
      ...defaultMileageExpense,
      address: {
        addressLine1: '456 Elm St',
        addressLine2: '',
        addressLine3: '',
        city: 'Seattle',
        stateCode: 'WA',
        zipCode: '98101',
      },
      tripType: 'RoundTrip',
      dateIncurred: '2023-10-15',
      costRequested: 30.75,
    };

    const { getByText, container } = renderExpenseCard(expense);

    expect(container.textContent).to.include('456 Elm St');
    expect(container.textContent).to.include('Seattle, WA 98101');
    expect(container.textContent).to.not.include('undefined');

    expect(getByText('Round trip')).to.exist;
  });

  it('opens the delete modal and calls deleteExpense on confirm', async () => {
    const { container } = renderExpenseCard();

    // Click delete button to open modal
    const deleteButton = container.querySelector('va-button-icon');
    expect(deleteButton).to.exist;
    fireEvent.click(deleteButton);

    // The modal should now be visible
    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('visible')).to.equal('true');

    // Simulate confirm (primary button) click on modal
    modal.__events.primaryButtonClick();

    await waitFor(() => {
      // After delete action, modal should be hidden
      expect(modal.getAttribute('visible')).to.equal('false');
    });
  });

  it('navigates to the edit route when Edit link is clicked', () => {
    const { getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/review']}>
        <Routes>
          <Route
            path="/review"
            element={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <ExpenseCard
                expense={defaultMileageExpense}
                address={defaultMileageExpense.address}
                apptId="test-appt-id"
                claimId="test-claim-id"
              />
            }
          />
          <Route path="/mileage" element={<div>Mileage Page</div>} />
          <Route
            path="/file-new-claim/:apptId/:claimId/:expenseType/:expenseId"
            element={<div>Edit Expense Page</div>}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      { initialState: getData(), reducers: reducer },
    );

    const editLink = getByTestId(
      `${defaultMileageExpense.id}-edit-expense-link`,
    );
    expect(editLink).to.exist;

    fireEvent.click(editLink);

    // Assert navigation happened
    expect(getByTestId('location-display').textContent).to.equal(
      '/file-new-claim/test-appt-id/test-claim-id/mileage/expense1',
    );
  });
});
