import React from 'react';
import { expect } from 'chai';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import reducer from '../../../../redux/reducer';
import ExpensesAccordion from '../../../../components/complex-claims/pages/ExpensesAccordion';

const apptId = 'appt-123';
const claimId = 'claim-456';
const documents = [
  {
    documentId: 'doc-1',
    filename: 'receipt.pdf',
    mimetype: 'application/pdf',
  },
];
const expenses = [
  {
    id: 'exp-1',
    expenseType: 'Mileage',
    costRequested: 15.0,
    tripType: 'RoundTrip',
    dateIncurred: '2025-10-15',
  },
  {
    id: 'exp-2',
    expenseType: 'Parking',
    description: 'Parking at hospital',
    costRequested: 10.0,
    documentId: 'doc-1',
    dateIncurred: '2025-10-15',
  },
];

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
        creation: {
          isLoading: false,
          error: null,
        },
        update: {
          id: '',
          isLoading: false,
          error: null,
        },
        delete: {
          id: '',
          isLoading: false,
          error: null,
        },
        data: [],
      },
    },
    appointment: {
      data: {
        id: apptId,
        facilityName: 'Test VA Medical Center',
        facilityAddress: {
          addressLine1: '123 Medical Center Drive',
          city: 'Test City',
          stateCode: 'TX',
          zipCode: '12345',
        },
        appointmentDate: '2025-10-15',
        appointmentTime: '10:00 AM',
      },
      error: null,
      isLoading: false,
    },
  },
};

// Helper render function
const renderAccordion = (props = {}, state = initialState) => {
  return renderWithStoreAndRouter(
    <MemoryRouter
      initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
    >
      <Routes>
        <Route
          path="/file-new-claim/:apptId/:claimId/review"
          element={<ExpensesAccordion {...props} />}
        />
      </Routes>
    </MemoryRouter>,
    {
      initialState: state,
      reducers: reducer,
    },
  );
};

describe('Complex Claims - <ExpensesAccordion />', () => {
  it('renders nothing when there are no expenses', () => {
    renderAccordion({ expenses: [] });
    // Should render null (no accordion in DOM)
    expect(document.querySelector('va-accordion')).to.not.exist;
  });

  it('renders a single accordion item when groupAccordionItemsByType=false and a add expense button', () => {
    const { container } = renderAccordion({
      expenses,
      documents,
      groupAccordionItemsByType: false,
    });

    const accordion = $('va-accordion');
    expect(accordion).to.exist;

    // Single accordion item with specific header
    const item = $('va-accordion-item[header="Submitted expenses"]');
    expect(item).to.exist;

    // Expect both Mileage and Parking expense cards to appear
    const expenseCards = document.querySelectorAll('va-card');
    expect(expenseCards.length).to.equal(2);

    // Expect multiple headers within the va-accordion-item

    // Does not expect the add expense button for expenses that are not Mileage
    const addParkingBtn = container.querySelector(
      '#add-parking-expense-button',
    );
    expect(addParkingBtn).to.not.exist;
  });

  it('renders multiple accordion items when groupAccordionItemsByType=true', () => {
    const { container } = renderAccordion({
      expenses,
      documents,
      groupAccordionItemsByType: true,
    });

    const accordionItems = document.querySelectorAll('va-accordion-item');
    expect(accordionItems.length).to.equal(2);

    // Multiple accourdion item headers should include the type and count
    expect(accordionItems[0].getAttribute('header')).to.include('Mileage');
    expect(accordionItems[1].getAttribute('header')).to.include('Parking');

    // Expect the add expense button for expenses that are not Mileage
    const addParkingBtn = container.querySelector(
      '#add-parking-expense-button',
    );
    expect(addParkingBtn).to.exist;
  });

  it('navigates to correct route when "Add another" button is clicked', () => {
    const { getByTestId, container } = renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/review`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/review"
            element={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <ExpensesAccordion
                expenses={expenses}
                documents={documents}
                groupAccordionItemsByType
              />
            }
          />
          <Route
            path="/file-new-claim/:apptId/:claimId/parking"
            element={<div>Parking Expense Page</div>}
          />
        </Routes>
        <LocationDisplay />
      </MemoryRouter>,
      {
        initialState,
        reducers: reducer,
      },
    );

    const addParkingButton = container.querySelector(
      '#add-parking-expense-button',
    );
    expect(addParkingButton).to.exist;

    fireEvent.click(addParkingButton);

    expect(getByTestId('location-display').textContent).to.equal(
      `/file-new-claim/${apptId}/${claimId}/parking`,
    );
  });

  it('renders headers for each expense group inside accordion item', () => {
    renderAccordion({ expenses, documents });

    const headers = document.querySelectorAll('h2.vads-u-font-size--h3');
    const headerTexts = Array.from(headers).map(h => h.textContent);

    expect(headerTexts).to.include.members(['Mileage', 'Parking']);
  });
});
