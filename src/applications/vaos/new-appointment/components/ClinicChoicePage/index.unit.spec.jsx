import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../../tests/mocks/setup';

import ClinicChoicePage from '.';
import MockClinicResponse from '../../../tests/fixtures/MockClinicResponse';
import MockFacilityResponse from '../../../tests/fixtures/MockFacilityResponse';
import { mockEligibilityFetches } from '../../../tests/mocks/mockApis';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS Page: ClinicChoicePage', () => {
  beforeEach(() => mockFetch());

  it('should display multiple clinics and require one to be chosen', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
        {
          id: '309',
          name: 'Red team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(
      store,
      '983',
      'primaryCare',
      new MockFacilityResponse(),
    );

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // Then the primary header should have focus
    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'Which VA clinic would you like to go to?',
    );

    // And the user should see radio buttons for each clinic
    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(3);
    expect(radioOptions[0]).to.have.attribute('label', 'Green team clinic');
    expect(radioOptions[1]).to.have.attribute('label', 'Red team clinic');
    expect(radioOptions[2]).to.have.attribute(
      'label',
      'I need a different clinic',
    );

    // When the user continues
    userEvent.click(screen.getByText(/continue/i));

    // The user should stay on the page
    expect(screen.history.push.called).to.be.false;

    await cleanup();
  });

  it('should go to direct schedule flow when choosing a clinic, request flow when not', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
        {
          id: '309',
          name: 'Red team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation care/i);
    await setVAFacility(store, '983', 'amputation', new MockFacilityResponse());

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // And the user selected a clinic
    const radioSelector = screen.container.querySelector('va-radio');
    let changeEvent = new CustomEvent('selected', {
      detail: { value: '983_309' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('preferred-date'),
    );

    // choosing the third option sends you to request flow
    changeEvent = new CustomEvent('selected', {
      detail: { value: 'NONE' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal('va-request/'),
    );

    await cleanup();
  });

  it('should show a yes/no choice when a single clinic is available', async () => {
    // Arrange
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
      ],
    });

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation care/i);
    await setVAFacility(store, '983', 'amputation', new MockFacilityResponse());

    // Act
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // Then the primary header should have focus
    const radioSelector = screen.container.querySelector('va-radio');
    expect(radioSelector).to.exist;
    expect(radioSelector).to.have.attribute(
      'label',
      'Would you like to make an appointment at Green team clinic?',
    );

    const radioOptions = screen.container.querySelectorAll('va-radio-option');
    expect(radioOptions).to.have.lengthOf(2);
    expect(radioOptions[0]).to.have.attribute(
      'label',
      'Yes, make my appointment here',
    );
    expect(radioOptions[1]).to.have.attribute(
      'label',
      'No, I need a different clinic',
    );

    // Yes should go to direct flow
    let changeEvent = new CustomEvent('selected', {
      detail: { value: '983_308' },
    });
    radioSelector.__events.vaValueChange(changeEvent);

    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal('preferred-date'),
    );

    // No sends you to the request flow
    changeEvent = new CustomEvent('selected', {
      detail: { value: 'NONE' },
    });
    radioSelector.__events.vaValueChange(changeEvent);

    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal('va-request/'),
    );

    await cleanup();
  });

  it('should retain form data after page changes', async () => {
    // Arrange
    const clinics = [
      MockClinicResponse.createResponses([
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
        {
          id: '309',
          name: 'Red team clinic',
          locationId: '983',
        },
      ]),
    ];

    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'primaryCare',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');

    // Act
    let screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    // And the user selected a clinic
    const radioSelector = screen.container.querySelector('va-radio');
    const changeEvent = new CustomEvent('selected', {
      detail: { value: '983_309' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    userEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await cleanup();

    screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    await waitFor(() => {
      expect(radioSelector).to.have.attribute('value', '983_309');
    });

    await cleanup();
  });

  it('should show the correct clinic name when filtered to matching', async () => {
    // Given two available clinics
    const clinics = MockClinicResponse.createResponses({
      clinics: [
        {
          id: '333',
          name: 'Filtered out clinic',
          locationId: '983',
        },
        {
          id: '308',
          name: 'Green team clinic',
          locationId: '983',
        },
      ],
    });

    // And the second clinic matches a past appointment
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: 'amputation',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      matchingClinics: clinics.slice(1),
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation care/i);
    await setVAFacility(store, '983', 'amputation', new MockFacilityResponse());

    // When the page is displayed
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await screen.findByText(/last amputation care appointment/i);

    // Then the page says the last appointment was at the matching clinic
    expect(screen.baseElement).to.contain.text(
      'Your last amputation care appointment was at Green team clinic:',
    );

    // And the user is asked if they want an appt at matching clinic
    expect(
      screen.container.querySelector(
        'va-radio[label="Would you like to make an appointment at Green team clinic?"',
      ),
    ).to.be.ok;
  });
});
