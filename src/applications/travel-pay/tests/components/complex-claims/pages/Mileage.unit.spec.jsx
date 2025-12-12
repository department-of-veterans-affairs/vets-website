import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Mileage from '../../../../components/complex-claims/pages/Mileage';
import reducer from '../../../../redux/reducer';

describe('Complex Claims Mileage - Add', () => {
  const TEST_CLAIM_ID = '4f5a9e2b-1c6a-4f1a-9b6c-2a7d3f1e8b9d';
  const TEST_APPT_ID = 'd2e3f4a5-b6c7-4d8e-9f1a-0b2c3d4e5f6a';

  const getAddState = () => ({
    travelPay: {
      appointment: {
        data: {
          id: TEST_APPT_ID,
          facilityName: 'Test VA Medical Center',
          facilityAddress: {
            addressLine1: '123 Medical Center Drive',
            city: 'Test City',
            stateCode: 'TX',
            zipCode: '12345',
          },
          appointmentDate: '2024-01-15',
          appointmentTime: '10:00 AM',
        },
        error: null,
        isLoading: false,
      },
      claimDetails: {
        data: {
          [TEST_CLAIM_ID]: {
            id: TEST_CLAIM_ID,
            status: 'InProgress',
            expenses: [],
            appointmentId: TEST_APPT_ID,
          },
        },
      },
      claimSubmission: { isSubmitting: false, error: null, data: null },
      complexClaim: {
        claim: {
          creation: { isLoading: false, error: null },
          submission: { id: '', isSubmitting: false, error: null, data: null },
          fetch: { isLoading: false, error: null },
          data: {
            documents: [],
          },
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [],
        },
      },
    },
    user: {
      profile: {
        vapContactInfo: {
          residentialAddress: {
            addressLine1: '123 Main St',
            addressLine2: 'Apt 1',
            addressLine3: '',
            city: 'Test City',
            stateCode: 'TX',
            zipCode: '12345',
            countryName: 'United States',
          },
        },
      },
    },
  });

  const renderComponent = () =>
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${TEST_APPT_ID}/${TEST_CLAIM_ID}/mileage/`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/mileage"
            element={<Mileage />}
          />
        </Routes>
      </MemoryRouter>,
      { initialState: getAddState(), reducers: reducer },
    );

  it('renders the component with all elements', () => {
    const screen = renderComponent();

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'Mileage',
    );
    expect($('va-additional-info[trigger="How we calculate mileage"]')).to
      .exist;
    expect($('va-radio[name="departureAddress"]')).to.exist;
    expect($('va-radio[name="tripType"]')).to.exist;
    expect($('.travel-pay-button-group')).to.exist;
    expect($('va-modal')).to.exist;
  });

  it('renders mileage information in additional info component', () => {
    renderComponent();

    const additionalInfo = $(
      'va-additional-info[trigger="How we calculate mileage"]',
    );
    expect(additionalInfo).to.exist;

    const infoContent = additionalInfo.textContent;
    expect(infoContent).to.include(
      'Mileage accounts for the gas you spent on this trip',
    );
    expect(infoContent).to.include(
      'We calculate the miles you drove to the appointment',
    );
    expect(infoContent).to.include(
      'We pay round-trip mileage for your scheduled appointments',
    );
    expect(infoContent).to.include(
      'We may only pay return mileage for unscheduled appointments',
    );
  });

  it('renders external link for mileage rates', () => {
    renderComponent();

    expect(
      $(
        'va-link[external][href="https://www.va.gov/resources/reimbursed-va-travel-expenses-and-mileage-rate/#mileage-reimbursement-rate"][text="Check current mileage rates"]',
      ),
    ).to.exist;
  });

  describe('Departure Address Radio Group', () => {
    it('renders departure address radio group with correct properties', () => {
      renderComponent();

      const departureRadio = $('va-radio[name="departureAddress"]');
      expect(departureRadio).to.exist;
      expect(departureRadio.getAttribute('label')).to.equal(
        'Which address did you depart from?',
      );
      expect(departureRadio.hasAttribute('required')).to.be.true;
    });

    it('renders departure address radio options', () => {
      renderComponent();

      const departureRadio = $('va-radio[name="departureAddress"]');
      expect(departureRadio).to.exist;
      expect(departureRadio.innerHTML).to.include('va-radio-option');
    });

    it('handles departure address selection change', () => {
      renderComponent();

      const departureRadio = $('va-radio[name="departureAddress"]');
      expect(departureRadio).to.exist;
      expect(departureRadio.value).to.equal(undefined);

      fireEvent(
        departureRadio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'home-address' },
        }),
      );

      expect(departureRadio.value).to.equal('home-address');
    });
  });

  describe('Trip Type Radio Group', () => {
    it('renders trip type radio group with correct properties', () => {
      renderComponent();

      const tripTypeRadio = $('va-radio[name="tripType"]');
      expect(tripTypeRadio).to.exist;
      expect(tripTypeRadio.getAttribute('label')).to.equal(
        'Was your trip round trip or one way?',
      );
      expect(tripTypeRadio.hasAttribute('required')).to.be.true;
    });

    it('renders trip type radio options', () => {
      renderComponent();

      const tripTypeRadio = $('va-radio[name="tripType"]');
      expect(tripTypeRadio).to.exist;
      expect(tripTypeRadio.innerHTML).to.include('va-radio-option');
    });

    it('handles trip type selection change', () => {
      renderComponent();

      const tripTypeRadio = $('va-radio[name="tripType"]');
      expect(tripTypeRadio.value).to.equal(undefined);

      fireEvent(
        tripTypeRadio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'round-trip' },
        }),
      );

      expect(tripTypeRadio.value).to.equal('round-trip');
    });
  });

  describe('Buttons', () => {
    it('renders button pair with correct properties', () => {
      renderComponent();

      const buttonGroup = $('.travel-pay-button-group');
      expect(buttonGroup).to.exist;

      const buttons = buttonGroup.querySelectorAll('va-button');
      expect(buttons).to.have.lengthOf(2);

      expect(buttons[0].hasAttribute('back')).to.be.true;
      expect(buttons[1].hasAttribute('continue')).to.be.true;
    });

    it('handles primary "Continue" button click', () => {
      renderComponent();

      const buttonGroup = $('.travel-pay-button-group');
      const continueButton = buttonGroup.querySelectorAll('va-button')[1];

      fireEvent.click(continueButton);
      expect(continueButton).to.exist;
    });

    it('handles secondary "Back" button click', () => {
      renderComponent();

      const buttonGroup = $('.travel-pay-button-group');
      const backButton = buttonGroup.querySelectorAll('va-button')[0];

      fireEvent.click(backButton);
      expect(backButton).to.exist;
    });

    it('renders "Cancel adding this expense" button', () => {
      const { container } = renderComponent();

      const addCancelButton = Array.from(
        container.querySelectorAll('va-button'),
      ).find(btn => btn.getAttribute('text') === 'Cancel adding this expense');
      expect(addCancelButton).to.exist;
    });
  });

  describe('Initial State', () => {
    it('starts with undefined values for both radio groups', () => {
      renderComponent();

      const departureRadio = $('va-radio[name="departureAddress"]');
      const tripTypeRadio = $('va-radio[name="tripType"]');
      expect(departureRadio.value).to.equal(undefined);
      expect(tripTypeRadio.value).to.equal(undefined);
    });

    it('has no radio options checked initially', () => {
      renderComponent();

      // Departure address radio group
      const departureHomeAddressRadio = $(
        'va-radio-option[value="home-address"]',
      );
      expect(departureHomeAddressRadio).to.exist;
      expect(departureHomeAddressRadio.getAttribute('checked')).to.equal(
        'false',
      );
      const departureAnotherAddressRadio = $(
        'va-radio-option[value="another-address"]',
      );
      expect(departureAnotherAddressRadio).to.exist;
      expect(departureAnotherAddressRadio.getAttribute('checked')).to.equal(
        'false',
      );

      // Trip type radio group
      const tripTypeRoundTripRadio = $('va-radio-option[value="RoundTrip"]');
      expect(tripTypeRoundTripRadio).to.exist;
      expect(tripTypeRoundTripRadio.getAttribute('checked')).to.equal('false');
      const tripTypeOneWayRadio = $('va-radio-option[value="OneWay"]');
      expect(tripTypeOneWayRadio).to.exist;
      expect(tripTypeOneWayRadio.getAttribute('checked')).to.equal('false');
    });
  });

  describe('CancelExpenseModal', () => {
    it('"Cancel adding this expense" button opens cancel modal', () => {
      const { container } = renderComponent();

      const button = container.querySelector('va-button');
      fireEvent.click(button);

      const modal = container.querySelector('va-modal');
      expect(modal).to.exist;
      expect(modal.visible).to.be.true;
    });
  });
});

describe('Complex Claims Mileage - Edit', () => {
  const TEST_CLAIM_ID = '4f5a9e2b-1c6a-4f1a-9b6c-2a7d3f1e8b9d';
  const TEST_EXPENSE_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d';
  const TEST_APPT_ID = 'd2e3f4a5-b6c7-4d8e-9f1a-0b2c3d4e5f6a';

  const getEditState = () => ({
    travelPay: {
      appointment: {
        data: {
          id: TEST_APPT_ID,
          facilityName: 'Test VA Medical Center',
          facilityAddress: {
            addressLine1: '123 Medical Center Drive',
            city: 'Test City',
            stateCode: 'TX',
            zipCode: '12345',
          },
          appointmentDate: '2024-01-15',
          appointmentTime: '10:00 AM',
        },
        error: null,
        isLoading: false,
      },
      claimDetails: {
        data: {
          [TEST_CLAIM_ID]: {
            id: TEST_CLAIM_ID,
            status: 'InProgress',
            expenses: [],
            appointmentId: TEST_APPT_ID,
          },
        },
      },
      claimSubmission: { isSubmitting: false, error: null, data: null },
      complexClaim: {
        claim: {
          creation: { isLoading: false, error: null },
          submission: { id: '', isSubmitting: false, error: null, data: null },
          fetch: { isLoading: false, error: null },
          data: {
            documents: [],
          },
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [
            {
              id: TEST_EXPENSE_ID,
              expenseType: 'Meal',
              vendorName: 'Saved Vendor',
              dateIncurred: '2025-11-17',
              costRequested: '10.50',
            },
          ],
        },
      },
    },
    user: {
      profile: {
        vapContactInfo: {
          residentialAddress: {
            addressLine1: '123 Main St',
            addressLine2: 'Apt 1',
            addressLine3: '',
            city: 'Test City',
            stateCode: 'TX',
            zipCode: '12345',
            countryName: 'United States',
          },
        },
      },
    },
  });

  const renderEditPage = () =>
    renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[
          `/file-new-claim/${TEST_APPT_ID}/${TEST_CLAIM_ID}/mileage/${TEST_EXPENSE_ID}`,
        ]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/mileage/:expenseId"
            element={<Mileage />}
          />
        </Routes>
      </MemoryRouter>,
      { initialState: getEditState(), reducers: reducer },
    );

  it('renders the component with all elements', () => {
    const { getByRole } = renderEditPage();

    expect(getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'Mileage',
    );
    expect($('va-additional-info[trigger="How we calculate mileage"]')).to
      .exist;
    expect($('va-radio[name="departureAddress"]')).to.exist;
    expect($('va-radio[name="tripType"]')).to.exist;
    expect($('.travel-pay-button-group')).to.exist;
    expect($('va-modal')).to.exist;
  });

  it('does NOT render "Cancel adding this expense" button', () => {
    const { container } = renderEditPage();

    const addCancelButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Cancel adding this expense');
    expect(addCancelButton).to.not.exist;
  });

  it('the "Cancel" button opens modal in edit mode', () => {
    renderEditPage();

    const backButton = $('.travel-pay-button-group').querySelectorAll(
      'va-button',
    )[0];
    fireEvent.click(backButton);

    const modal = $('va-modal');
    expect(modal.hasAttribute('visible')).to.be.true;
  });

  it('Cancel" button opens modal in edit mode', () => {
    const { container } = renderEditPage();

    const backButton = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('text') === 'Cancel',
    );
    fireEvent.click(backButton);
    const modal = container.querySelector('va-modal');
    expect(modal.getAttribute('visible')).to.equal('true');
  });

  it('renders button pair with correct properties', () => {
    renderEditPage();

    const buttonGroup = $('.travel-pay-button-group');
    expect(buttonGroup).to.exist;

    const buttons = buttonGroup.querySelectorAll('va-button');
    expect(buttons).to.have.lengthOf(2);

    expect(buttons[0].hasAttribute('back')).to.be.true;
    expect(buttons[1].hasAttribute('continue')).to.be.true;
  });

  it('handles primary "Save and continue" button click', () => {
    renderEditPage();

    const buttonGroup = $('.travel-pay-button-group');
    const continueButton = buttonGroup.querySelectorAll('va-button')[1];

    fireEvent.click(continueButton);
    expect(continueButton).to.exist;
  });

  it('handles secondary "Cancel" button click', () => {
    renderEditPage();

    const buttonGroup = $('.travel-pay-button-group');
    const backButton = buttonGroup.querySelectorAll('va-button')[0];

    fireEvent.click(backButton);
    expect(backButton).to.exist;
  });
});
