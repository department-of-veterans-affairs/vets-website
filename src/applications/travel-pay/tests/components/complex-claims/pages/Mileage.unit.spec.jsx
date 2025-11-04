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

  const renderComponent = (apptId = defaultApptId, claimId = 'claim123') => {
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
        initialState: {},
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
    expect($('va-button-pair')).to.exist;
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
        'Which address did you depart from?',
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

      const buttonPair = $('va-button-pair');
      expect(buttonPair).to.exist;
      expect(buttonPair.hasAttribute('continue')).to.be.true;
      expect(buttonPair.hasAttribute('disable-analytics')).to.be.true;
      expect(buttonPair.getAttribute('class')).to.include('vads-u-margin-y--2');
    });

    it('handles primary button click', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');
      expect(buttonPair).to.exist;

      // Simulate primary button click
      fireEvent(buttonPair, new CustomEvent('primaryClick'));

      // Since the handler is empty, we just verify the event can be fired
      // In a real implementation, this would test navigation or form submission
      expect(buttonPair).to.exist;
    });

    it('handles secondary button click', () => {
      renderComponent();

      const buttonPair = $('va-button-pair');
      expect(buttonPair).to.exist;

      // Simulate secondary button click
      fireEvent(buttonPair, new CustomEvent('secondaryClick'));

      // Since the handler is empty, we just verify the event can be fired
      // In a real implementation, this would test back navigation
      expect(buttonPair).to.exist;
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
