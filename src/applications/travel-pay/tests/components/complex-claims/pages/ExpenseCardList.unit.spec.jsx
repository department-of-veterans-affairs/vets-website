import React from 'react';
import { expect } from 'chai';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom-v5-compat';
import { fireEvent } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import reducer from '../../../../redux/reducer';
import ExpenseCardList from '../../../../components/complex-claims/pages/ExpenseCardList';

const apptId = 'appt-123';
const claimId = 'claim-456';

const expensesList = [
  {
    id: 'exp-1',
    expenseType: 'Parking',
    costRequested: 10.0,
    dateIncurred: '2025-10-15',
  },
  {
    id: 'exp-2',
    expenseType: 'Parking',
    costRequested: 12.0,
    dateIncurred: '2025-10-20',
  },
];

// Needed for navigation tests
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

const initialState = {
  user: {
    profile: {
      vapContactInfo: {
        residentialAddress: {
          addressLine1: '123 Main St',
          city: 'Denver',
          stateCode: 'CO',
          zipCode: '80202',
        },
      },
    },
  },
  travelPay: {
    complexClaim: {
      expenses: {
        creation: { isLoading: false, error: null },
        update: { id: '', isLoading: false, error: null },
        delete: { id: '', isLoading: false, error: null },
        data: [],
      },
    },
  },
};

// Helper render
const renderList = (props = {}, state = initialState) => {
  return renderWithStoreAndRouter(
    <MemoryRouter
      initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
    >
      <Routes>
        <Route
          path="/file-new-claim/:apptId/:claimId/review"
          element={<ExpenseCardList {...props} />}
        />
      </Routes>
    </MemoryRouter>,
    { initialState: state, reducers: reducer },
  );
};

describe('Complex Claims - <ExpenseCardList />', () => {
  it('renders the header when showHeader=true', () => {
    const { getByTestId } = renderList({
      type: 'Parking',
      expensesList,
      showHeader: true,
    });

    const header = getByTestId('expense-type-header');
    expect(header).to.exist;
    expect(header.textContent).to.equal('Parking'); // From getExpenseType()
  });

  it('does not render the header when showHeader=false', () => {
    const { queryByTestId } = renderList({
      type: 'Parking',
      expensesList,
      showHeader: false,
    });

    expect(queryByTestId('expense-type-header')).to.not.exist;
  });

  it('renders one ExpenseCard per expense', () => {
    renderList({
      type: 'Parking',
      expensesList,
    });

    const cards = document.querySelectorAll('va-card');
    expect(cards.length).to.equal(2);
  });

  it('renders the Add button when showAddButton=true and type != Mileage', () => {
    const { container } = renderList({
      type: 'Parking',
      expensesList,
      showAddButton: true,
    });

    const addButton = container.querySelector('#add-parking-expense-button');
    expect(addButton).to.exist;
  });

  it('does not render Add button when showAddButton=false', () => {
    const { container } = renderList({
      type: 'Parking',
      expensesList,
      showAddButton: false,
    });

    const addButton = container.querySelector('#add-parking-expense-button');
    expect(addButton).to.not.exist;
  });

  it('does not render Add button for Mileage even when showAddButton=true', () => {
    const { container } = renderList({
      type: 'Mileage',
      expensesList,
      showAddButton: true,
    });

    const addButton = container.querySelector('#add-mileage-expense-button');
    expect(addButton).to.not.exist;
  });

  it('navigates correctly when the Add button is clicked', () => {
    const { container, getByTestId } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <ExpenseCardList
                type="Parking"
                expensesList={expensesList}
                showAddButton
              />
            }
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/parking"
            element={<div>Parking Page</div>}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      { initialState, reducers: reducer },
    );

    const button = container.querySelector('#add-parking-expense-button');
    expect(button).to.exist;

    fireEvent.click(button);

    expect(getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/parking`,
    );
  });
});
