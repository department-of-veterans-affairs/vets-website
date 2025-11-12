import React from 'react';
import { expect } from 'chai';
import { fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import Mileage from '../../../../components/complex-claims/pages/Mileage';
import reducer from '../../../../redux/reducer';

describe('Complex Claims Mileage', () => {
  const defaultApptId = '12345';
  const defaultClaimId = '67890';

  const renderComponent = (
    apptId = defaultApptId,
    claimId = defaultClaimId,
  ) => {
    const initialState = {
      travelPay: {
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
            appointmentDate: '2024-01-15',
            appointmentTime: '10:00 AM',
          },
          error: null,
          isLoading: false,
        },
        claimDetails: {
          data: {
            [claimId]: {
              id: claimId,
              status: 'InProgress',
              expenses: [],
              appointmentId: apptId,
            },
          },
        },
        complexClaim: {
          claim: {
            creation: {
              isLoading: false,
              error: null,
            },
            submission: {
              id: '',
              isSubmitting: false,
              error: null,
              data: null,
            },
            data: null,
          },
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
        expense: {
          isLoading: false,
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
    };

    return renderWithStoreAndRouter(
      <MemoryRouter
        initialEntries={[`/file-new-claim/${apptId}/${claimId}/mileage`]}
      >
        <Routes>
          <Route
            path="/file-new-claim/:apptId/:claimId/mileage"
            element={<Mileage />}
          />
        </Routes>
      </MemoryRouter>,
      {
        initialState,
        reducers: reducer,
      },
    );
  };

  it('renders the component with all elements', () => {
    const screen = renderComponent();

    expect(screen.getByRole('heading', { level: 1 })).to.have.property(
      'textContent',
      'Mileage',
    );
    expect($('va-additional-info[trigger="How we calculate mileage"]')).to
      .exist;
    expect($('va-radio[id="departure-address"]')).to.exist;
    expect($('va-radio[id="trip-type"]')).to.exist;
    expect($('.travel-pay-button-group')).to.exist;
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

      const departureRadio = $('va-radio[id="departure-address"]');
      expect(departureRadio).to.exist;
      expect(departureRadio.getAttribute('label')).to.equal(
        'Which address did you depart from?',
      );
      expect(departureRadio.hasAttribute('required')).to.be.true;
    });

    it('renders departure address radio options', () => {
      renderComponent();

      const departureRadio = $('va-radio[id="departure-address"]');
      expect(departureRadio).to.exist;

      // Verify the radio group has options by checking innerHTML contains va-radio-option
      expect(departureRadio.innerHTML).to.include('va-radio-option');
    });

    it('handles departure address selection change', () => {
      renderComponent();

      const departureRadio = $('va-radio[id="departure-address"]');
      expect(departureRadio.value).to.equal('');

      // Simulate selection change
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

      const tripTypeRadio = $('va-radio[id="trip-type"]');
      expect(tripTypeRadio).to.exist;
      expect(tripTypeRadio.getAttribute('label')).to.equal(
        'Was your trip round trip or one way?',
      );
      expect(tripTypeRadio.hasAttribute('required')).to.be.true;
    });

    it('renders trip type radio options', () => {
      renderComponent();

      const tripTypeRadio = $('va-radio[id="trip-type"]');
      expect(tripTypeRadio).to.exist;

      // Verify the radio group has options by checking innerHTML contains va-radio-option
      expect(tripTypeRadio.innerHTML).to.include('va-radio-option');
    });

    it('handles trip type selection change', () => {
      renderComponent();

      const tripTypeRadio = $('va-radio[id="trip-type"]');
      expect(tripTypeRadio.value).to.equal('');

      // Simulate selection change
      fireEvent(
        tripTypeRadio,
        new CustomEvent('vaValueChange', {
          detail: { value: 'round-trip' },
        }),
      );

      expect(tripTypeRadio.value).to.equal('round-trip');
    });
  });

  describe('Button Pair', () => {
    it('renders button pair with correct properties', () => {
      renderComponent();

      const buttonGroup = $('.travel-pay-button-group');
      expect(buttonGroup).to.exist;

      const buttons = buttonGroup.querySelectorAll('va-button');
      expect(buttons).to.have.lengthOf(2);

      // Check back button
      const backButton = buttons[0];
      expect(backButton).to.exist;
      expect(backButton.hasAttribute('back')).to.be.true;

      // Check continue button
      const continueButton = buttons[1];
      expect(continueButton).to.exist;
      expect(continueButton.hasAttribute('continue')).to.be.true;
    });

    it('handles primary button click', () => {
      renderComponent();

      const buttonGroup = $('.travel-pay-button-group');
      expect(buttonGroup).to.exist;

      const continueButton = buttonGroup.querySelectorAll('va-button')[1];
      expect(continueButton).to.exist;

      // Simulate continue button click
      fireEvent.click(continueButton);

      // Since the handler is empty, we just verify the event can be fired
      // In a real implementation, this would test navigation or form submission
      expect(continueButton).to.exist;
    });

    it('handles secondary button click', () => {
      renderComponent();

      const buttonGroup = $('.travel-pay-button-group');
      expect(buttonGroup).to.exist;

      const backButton = buttonGroup.querySelectorAll('va-button')[0];
      expect(backButton).to.exist;

      // Simulate back button click
      fireEvent.click(backButton);

      // Since the handler is empty, we just verify the event can be fired
      // In a real implementation, this would test back navigation
      expect(backButton).to.exist;
    });
  });

  describe('Initial State', () => {
    it('starts with empty values for both radio groups', () => {
      renderComponent();

      const departureRadio = $('va-radio[id="departure-address"]');
      const tripTypeRadio = $('va-radio[id="trip-type"]');

      expect(departureRadio.value).to.equal('');
      expect(tripTypeRadio.value).to.equal('');
    });

    it('has no radio options checked initially', () => {
      renderComponent();

      const departureRadio = $('va-radio[id="departure-address"]');
      const tripTypeRadio = $('va-radio[id="trip-type"]');

      expect(departureRadio.value).to.equal('');
      expect(tripTypeRadio.value).to.equal('');
    });
  });
});
