import React from 'react';
import { fireEvent, waitFor, within } from '@testing-library/react';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import ExpenseCard from '../../../../components/complex-claims/pages/ExpenseCard';
import reducer from '../../../../redux/reducer';
import * as actions from '../../../../redux/actions';

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

  ExpenseCard.defaultProps = {
    address: {
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      stateCode: '',
      zipCode: '',
    },
    apptId: 'test-appt-id',
    claimId: 'test-claim-id',
    showEditDelete: true,
  };

  // Helper to render the component with router + store
  const renderExpenseCard = (
    expense = defaultMileageExpense,
    showEditDelete = true,
  ) =>
    renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/review']}>
        <ExpenseCard
          expense={expense}
          address={expense.address}
          showEditDelete={showEditDelete}
        />
      </MemoryRouter>,
      { initialState: getData(), reducers: reducer },
    );

  it('renders mileage component correctly', () => {
    const { getByText, container, queryByTestId } = renderExpenseCard();

    // Header
    expect(getByText('Mileage expense')).to.exist;

    // Address
    expect(getByText('Which address did you depart from?')).to.exist;
    expect(container.textContent).to.include('123 Main St');
    expect(container.textContent).to.include('Apt 4B');
    expect(container.textContent).to.include('Washington, DC 20001');

    // Edit button
    const editLink = queryByTestId('expense1-edit-expense-link');
    expect(editLink).to.exist;
    expect(editLink.textContent).to.include('Edit');

    // Delete button exists
    const deleteButton = queryByTestId('expense1-delete-expense-button');
    expect(deleteButton).to.exist;
    expect(deleteButton.getAttribute('button-type')).to.equal('delete');

    // Delete modal exists
    const deleteModal = queryByTestId('delete-expense-modal');
    expect(deleteModal).to.exist;
    expect(deleteModal.getAttribute('visible')).to.equal('false');
  });

  it('renders non-mileage expense correctly', () => {
    const { getByTestId } = renderExpenseCard(defaultNonMileageExpense);

    const card = getByTestId('expense-card-expense2');

    // Check the header text inside the card
    expect(
      within(card).getByRole('heading', { name: 'October 15, 2023, $15.00' }),
    ).to.exist;

    // Check description section
    expect(within(card).getByText('Description')).to.exist;
    expect(within(card).getByText('Parking at hospital')).to.exist;

    // Check file name section
    expect(within(card).getByText('File name')).to.exist;
    expect(within(card).getByText('test.pdf')).to.exist;
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

    const { container } = renderExpenseCard(expense);

    expect(container.textContent).to.include('456 Elm St');
    expect(container.textContent).to.include('Seattle, WA 98101');
    expect(container.textContent).to.not.include('undefined');
  });

  it('opens the delete modal and calls deleteExpenseAndDocument on confirm', async () => {
    const { container, getByTestId } = renderExpenseCard();

    // Click delete button to open modal
    const deleteButton = container.querySelector('va-button-icon');
    expect(deleteButton).to.exist;
    fireEvent.click(deleteButton);

    // The modal should now be visible
    // const modal = container.querySelector('va-modal');
    const modal = getByTestId('delete-expense-modal');
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

  it('renders mileage component with no edit button, delete button or delete modal', () => {
    const { getByText, container, queryByTestId } = renderExpenseCard(
      defaultMileageExpense,
      false,
    );

    expect(getByText('Mileage expense')).to.exist;

    // Address
    expect(getByText('Which address did you depart from?')).to.exist;
    expect(container.textContent).to.include('123 Main St');
    expect(container.textContent).to.include('Apt 4B');
    expect(container.textContent).to.include('Washington, DC 20001');

    // Edit button does not exist
    expect(queryByTestId('expense1-edit-expense-link')).to.not.exist;

    // Delete button does not exist
    expect(queryByTestId('expense1-delete-expense-button')).to.not.exist;

    // Delete modal does not exist
    expect(queryByTestId('delete-expense-modal')).to.not.exist;
  });

  it('dispatches setReviewPageAlert when deleting expense fails', async () => {
    // Spy on setReviewPageAlert
    const alertSpy = sinon.spy(actions, 'setReviewPageAlert');

    // Stub deleteExpenseDeleteDocument to reject
    const deleteStub = sinon
      .stub(actions, 'deleteExpenseDeleteDocument')
      .callsFake(() => () => Promise.reject(new Error('Delete failed')));

    const { getByTestId } = renderExpenseCard(defaultMileageExpense);

    // Open the delete modal
    const deleteButton = getByTestId('expense1-delete-expense-button');
    fireEvent.click(deleteButton);

    const modal = getByTestId('delete-expense-modal');
    expect(modal.getAttribute('visible')).to.equal('true');

    // Trigger primary button click
    await act(async () => {
      modal.__events.primaryButtonClick();
    });

    // Assert that setReviewPageAlert was called with the correct payload
    const alertPayload = alertSpy.firstCall.args[0];
    expect(alertPayload.title).to.include("We couldn't delete this expense");
    expect(alertPayload.description).to.include('Try again later');
    expect(alertPayload.type).to.equal('error');

    // Modal should close
    expect(modal.getAttribute('visible')).to.equal('false');

    // Clean up
    deleteStub.restore();
    alertSpy.restore();
  });
});
