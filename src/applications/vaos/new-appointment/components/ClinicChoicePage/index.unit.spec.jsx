import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../../tests/mocks/setup';

import ClinicChoicePage from '.';
import { getV2ClinicMock } from '../../../tests/mocks/mock';
import { createMockCheyenneFacility } from '../../../tests/mocks/data';
import { mockEligibilityFetches } from '../../../tests/mocks/fetch';

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
    const clinics = [
      getV2ClinicMock({
        id: '308',
        serviceName: 'Green team clinic',
        stationId: '983',
      }),
      getV2ClinicMock({
        id: '309',
        serviceName: 'Red team clinic',
        stationId: '983',
      }),
    ];
    const facilityData = createMockCheyenneFacility();
    facilityData.id = '983';
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
    await setVAFacility(store, '983', 'primaryCare', { facilityData });

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

    userEvent.click(screen.getByText(/continue/i));

    // Then there should be a validation error
    // Assertion currently disabled due to
    // https://github.com/department-of-veterans-affairs/va.gov-team/issues/82624
    // expect(await screen.findByRole('alert')).to.contain.text(
    //   'You must provide a response',
    // );
    expect(screen.history.push.called).not.to.be.true;

    await cleanup();
  });

  it('should go to direct schedule flow when choosing a clinic, request flow when not', async () => {
    const clinics = [
      getV2ClinicMock({
        id: '308',
        serviceName: 'Green team clinic',
        stationId: '983',
      }),
      getV2ClinicMock({
        id: '309',
        serviceName: 'Red team clinic',
        stationId: '983',
      }),
    ];
    const facilityData = createMockCheyenneFacility();
    facilityData.id = '983';
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
    await setVAFacility(store, '983', 'amputation', { facilityData });

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
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/preferred-date',
      ),
    );

    // choosing the third option sends you to request flow
    changeEvent = new CustomEvent('selected', {
      detail: { value: 'NONE' },
    });
    radioSelector.__events.vaValueChange(changeEvent);
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );

    await cleanup();
  });

  it('should show a yes/no choice when a single clinic is available', async () => {
    const clinics = [
      getV2ClinicMock({
        id: '308',
        serviceName: 'Green team clinic',
        stationId: '983',
      }),
    ];
    const facilityData = createMockCheyenneFacility();
    facilityData.id = '983';
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
    await setVAFacility(store, '983', 'amputation', { facilityData });

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
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/preferred-date',
      ),
    );

    // No sends you to the request flow
    changeEvent = new CustomEvent('selected', {
      detail: { value: 'NONE' },
    });
    radioSelector.__events.vaValueChange(changeEvent);

    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.secondCall.args[0]).to.equal(
        '/new-appointment/request-date',
      ),
    );

    await cleanup();
  });

  it('should retain form data after page changes', async () => {
    const clinics = [
      getV2ClinicMock({
        id: '308',
        serviceName: 'Green team clinic',
        stationId: '983',
      }),
      getV2ClinicMock({
        id: '309',
        serviceName: 'Red team clinic',
        stationId: '983',
      }),
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
    const clinics = [
      getV2ClinicMock({
        id: '333',
        serviceName: 'Filtered out clinic',
        stationId: '983',
      }),
      getV2ClinicMock({
        id: '308',
        serviceName: 'Green team clinic',
        stationId: '983',
      }),
    ];
    const facilityData = createMockCheyenneFacility();
    facilityData.id = '983';

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
    await setVAFacility(store, '983', 'amputation', { facilityData });

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
