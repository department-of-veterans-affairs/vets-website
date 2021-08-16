import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';
import {
  createTestStore,
  renderWithStoreAndRouter,
  setTypeOfCare,
  setVAFacility,
} from '../../mocks/setup';
import userEvent from '@testing-library/user-event';

import ClinicChoicePage from '../../../new-appointment/components/ClinicChoicePage';
import { mockEligibilityFetches, mockFacilityFetch } from '../../mocks/helpers';
import { getClinicMock, getVAFacilityMock } from '../../mocks/v0';
import { mockFetch } from 'platform/testing/unit/helpers';

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

describe('VAOS <ClinicChoicePage>', () => {
  beforeEach(() => mockFetch());
  it('should display multiple clinics and require one to be chosen', async () => {
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];
    const facilityData = {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    };
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983', { facilityData });

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
      'Please provide a response',
    );
    expect(screen.history.push.called).not.to.be.true;
  });

  it('should go to direct schedule flow when choosing a clinic, request flow when not', async () => {
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '211',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });
    mockFacilityFetch('vha_442', getVAFacilityMock());

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation/i);
    await setVAFacility(store, '983');

    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });

    await screen.findByText(/Choose a VA clinic/i);
    expect(screen.baseElement).to.contain.text(
      'In the last 24 months you’ve had an amputation care appointment at the following Fake name clinics:',
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
  });

  it('should show message if user choose a different clinic but is not eligible for requests', async () => {
    // Given a list of clinics
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];

    // And the user is not passing the request past visits check
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '211',
      limit: true,
      requestPastVisits: false,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });
    mockFacilityFetch('vha_442', getVAFacilityMock());

    // And the page has loaded
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /amputation/i);
    await setVAFacility(store, '983', {
      requestCriteria: {
        patientHistoryDuration: 1095,
        patientHistoryRequired: 'Yes',
      },
    });
    const screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await screen.findByText(/Choose a VA clinic/i);

    // When the user choose a different clinic than what is listed
    // choosing the third option sends you to request flow
    userEvent.click(screen.getByText(/need a different clinic/i));
    await waitFor(
      () =>
        expect(screen.getByLabelText(/need a different clinic/i).checked).to.be
          .true,
    );

    // Then the request past visits warning message is shown
    await screen.findByText(
      /You need to have visited this facility within the past 36 months/i,
    );

    // And the user can't continue
    expect(screen.getByText(/continue/i)).to.have.attribute('disabled');
  });

  it('should show a yes/no choice when a single clinic is available', async () => {
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
    ];
    const facilityData = {
      id: 'vha_442',
      attributes: {
        ...getVAFacilityMock().attributes,
        uniqueId: '442',
        name: 'Cheyenne VA Medical Center',
        address: {
          physical: {
            zip: '82001-5356',
            city: 'Cheyenne',
            state: 'WY',
            address1: '2360 East Pershing Boulevard',
          },
        },
        phone: {
          main: '307-778-7550',
        },
      },
    };
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '211',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });

    const store = createTestStore(initialState);

    await setTypeOfCare(store, /amputation/i);
    await setVAFacility(store, '983', { facilityData });

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
    expect(screen.baseElement).to.contain.text('307-778-7550');

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
  });

  it('should retain form data after page changes', async () => {
    const clinics = [
      {
        id: '308',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '308',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Green team clinic',
        },
      },
      {
        id: '309',
        attributes: {
          ...getClinicMock(),
          siteCode: '983',
          clinicId: '309',
          institutionCode: '983',
          clinicFriendlyLocationName: 'Red team clinic',
        },
      },
    ];
    mockEligibilityFetches({
      siteId: '983',
      facilityId: '983',
      typeOfCareId: '323',
      limit: true,
      requestPastVisits: true,
      directPastVisits: true,
      clinics,
      pastClinics: true,
    });
    mockFacilityFetch('vha_442', getVAFacilityMock());

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

    await cleanup();

    screen = renderWithStoreAndRouter(<ClinicChoicePage />, {
      store,
    });
    await waitFor(
      () => expect(screen.getByLabelText(/red team/i).checked).to.be.true,
    );
  });
});
