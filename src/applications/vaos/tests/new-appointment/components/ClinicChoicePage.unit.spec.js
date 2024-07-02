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
} from '../../mocks/setup';

import ClinicChoicePage from '../../../new-appointment/components/ClinicChoicePage';
import { getV2ClinicMock } from '../../mocks/mock';
import { createMockCheyenneFacility } from '../../mocks/data';
import { mockEligibilityFetches } from '../../mocks/fetch';

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

    await screen.findByText(/Choose a VA clinic/i);

    expect(screen.baseElement).to.contain.text(
      'Primary care appointments are available at the following Cheyenne VA Medical Center clinics:',
    );
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');

    expect(screen.baseElement).to.contain.text(
      'Choose a clinic below or request a different clinic for this appointment.',
    );
    expect(await screen.findAllByRole('radio')).to.have.length(3);
    expect(screen.getByLabelText('Green team clinic')).to.have.tagName('input');
    expect(screen.getByLabelText('Red team clinic')).to.have.tagName('input');
    expect(screen.getByLabelText('I need a different clinic')).to.have.tagName(
      'input',
    );

    userEvent.click(screen.getByText(/continue/i));

    expect(await screen.findByRole('alert')).to.contain.text(
      'You must provide a response',
    );
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

    await setTypeOfCare(store, /amputation/i);
    await setVAFacility(store, '983', 'amputation', { facilityData });

    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    await screen.findByText(/Choose a VA clinic/i);
    expect(screen.baseElement).to.contain.text(
      'In the last 24 months you’ve had an amputation care appointment at the following Cheyenne VA Medical Center clinics:',
    );

    userEvent.click(screen.getByLabelText(/red team/i));
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );
    userEvent.click(screen.getByText(/continue/i));

    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/preferred-date',
      ),
    );

    // choosing the third option sends you to request flow
    userEvent.click(screen.getByText(/need a different clinic/i));
    await waitFor(
      () =>
        expect(screen.getByLabelText(/need a different clinic/i).checked).to.be
          .true,
    );
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

    await setTypeOfCare(store, /amputation/i);
    await setVAFacility(store, '983', 'amputation', { facilityData });

    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    await screen.findByText(/last amputation care appointment/i);
    expect(screen.baseElement).to.contain.text(
      'Your last amputation care appointment was at Green team clinic:',
    );
    expect(screen.baseElement).to.contain.text('Choose a VA clinic');
    expect(screen.baseElement).to.contain.text('Cheyenne VA Medical Center');
    expect(screen.baseElement).to.contain.text(
      'Cheyenne, WyomingWY 82001-5356',
    );
    expect(screen.getByTestId('facility-telephone')).to.exist;

    expect(screen.baseElement).to.contain.text(
      'Would you like to make an appointment at Green team clinic',
    );
    expect(screen.getAllByRole('radio').length).to.equal(2);
    expect(
      screen.getByLabelText('Yes, make my appointment here'),
    ).to.have.tagName('input');
    expect(
      screen.getByLabelText('No, I need a different clinic'),
    ).to.have.tagName('input');

    // Yes should go to direct flow
    userEvent.click(screen.getByLabelText(/yes/i));
    await waitFor(
      () => expect(screen.getByLabelText(/yes/i).checked).to.be.true,
    );

    userEvent.click(screen.getByText(/continue/i));
    await waitFor(() =>
      expect(screen.history.push.firstCall.args[0]).to.equal(
        '/new-appointment/preferred-date',
      ),
    );

    // No sends you to the request flow
    userEvent.click(screen.getByText(/No/));
    await waitFor(() => expect(screen.getByLabelText(/No/).checked).to.be.true);

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

    await screen.findByText(/Choose a VA clinic/i);

    userEvent.click(screen.getByLabelText(/red team/i));
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );
    userEvent.click(screen.getByRole('button', { name: /Continue/i }));

    await cleanup();

    screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );

    await cleanup();
  });

  // Flaky test: https://github.com/department-of-veterans-affairs/va.gov-team/issues/82977
  it.skip('should show the correct clinic name when filtered to matching', async () => {
    // Given two available clinics
    const clinics = [
      getV2ClinicMock({
        id: '309',
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

    await setTypeOfCare(store, /amputation/i);
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
    expect(screen.baseElement).to.contain.text(
      'Would you like to make an appointment at Green team clinic',
    );
  });
});
