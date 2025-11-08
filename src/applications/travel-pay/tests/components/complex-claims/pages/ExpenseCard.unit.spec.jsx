import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';
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
import Mileage from '../../../../components/complex-claims/pages/Mileage';

describe('ExpenseCard', () => {
  const LocationDisplay = () => {
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
  };

  const editRoute = '../mileage';

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
    tripType: 'OneWay',
    expenseType: 'Mileage',
  };

  const defaultNonMileageExpense = {
    id: 'expense2',
    expenseType: 'Parking',
    description: 'Parking at hospital',
    document: { filename: 'test.pdf' },
  };

  const getData = () => ({});

  // Helper to render the component with router + store
  const renderExpenseCard = (
    expense = defaultMileageExpense,
    editToRoute = editRoute,
  ) =>
    renderWithStoreAndRouter(
      <MemoryRouter initialEntries={['/review']}>
        <ExpenseCard
          expense={expense}
          header={`${expense.expenseType} expense`}
          editToRoute={editToRoute}
        />
      </MemoryRouter>,
      { initialState: getData(), reducers: reducer },
    );

  it('renders mileage component correctly', () => {
    const { getByText, container } = renderExpenseCard();

    // Header
    expect(getByText('Mileage expense')).to.exist;

    // Address
    expect(getByText('Which address did you depart from?')).to.exist;
    expect(container.textContent).to.include('123 Main St');
    expect(container.textContent).to.include('Apt 4B');
    expect(container.textContent).to.include('Washington, DC 20001');

    // Trip type
    expect(getByText('Was your trip round trip or one way?')).to.exist;
    expect(container.textContent).to.include('One way');

    // Edit button
    const editLink = container.querySelector('a');
    expect(editLink).to.exist;
    expect(editLink.textContent).to.include('EDIT');

    // Delete button exists
    const deleteButton = container.querySelector('va-button-icon');
    expect(deleteButton).to.exist;
    expect(deleteButton.getAttribute('button-type')).to.equal('delete');
  });

  it('renders non-Mileage expense correctly', () => {
    const { getByText } = renderExpenseCard(defaultNonMileageExpense);

    expect(getByText('Parking expense')).to.exist;
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
    };

    const { getByText, container } = renderExpenseCard(expense);

    expect(container.textContent).to.include('456 Elm St');
    expect(container.textContent).to.include('Seattle, WA 98101');
    expect(container.textContent).to.not.include('undefined');

    expect(getByText('Round trip')).to.exist;
  });

  it('opens the delete modal and calls deleteExpense on confirm', async () => {
    const consoleSpy = sinon.spy(console, 'log');
    const { container } = renderExpenseCard();

    // Click delete button to open modal
    const deleteButton = container.querySelector('va-button-icon');
    expect(deleteButton).to.exist;
    fireEvent.click(deleteButton);

    // The modal should now be visible
    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;

    // Simulate confirm (primary button) click on modal
    modal.__events.primaryButtonClick();

    await waitFor(() => {
      expect(
        consoleSpy.calledWith(
          `Delete clicked for expense id: ${defaultMileageExpense.id}`,
        ),
      ).to.be.true;
    });

    consoleSpy.restore();
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
                header="Mileage expense"
                editToRoute={editRoute}
              />
            }
          />
          <Route path="/mileage" element={<Mileage />} />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      { initialState: {}, reducers: reducer },
    );

    const editLink = getByTestId(
      `${defaultMileageExpense.id}-edit-expense-link`,
    );
    expect(editLink).to.exist;

    fireEvent.click(editLink);

    // Assert navigation happened
    expect(getByTestId('location-display').textContent).to.equal('/mileage');
  });
});
