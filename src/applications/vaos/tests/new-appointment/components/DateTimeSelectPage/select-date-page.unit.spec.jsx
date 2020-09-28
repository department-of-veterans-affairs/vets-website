import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent, waitFor } from '@testing-library/dom';
import { cleanup } from '@testing-library/react';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';

import { getClinicMock, getAppointmentSlotMock } from '../../../mocks/v0';
import {
  createTestStore,
  setTypeOfCare,
  setVAFacility,
  setClinic,
  setPreferredDate,
  renderWithStoreAndRouter,
} from '../../../mocks/setup';
import {
  mockEligibilityFetches,
  mockAppointmentSlotFetch,
} from '../../../mocks/helpers';

import DateTimeSelectPage from '../../../../new-appointment/components/DateTimeSelectPage';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingVSPAppointmentNew: false,
    vaOnlineSchedulingDirect: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
};

describe('VAOS integration: select date time slot page', () => {
  beforeEach(() => mockFetch());
  afterEach(() => resetFetch());

  it('should fetch new slots after clinic change', async () => {
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
    const slot308Date = moment()
      .day(9)
      .hour(9)
      .minute(0)
      .second(0);
    const slots308 = [
      {
        ...getAppointmentSlotMock(),
        startDateTime: slot308Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        endDateTime: slot308Date
          .clone()
          .minute(20)
          .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
      },
    ];

    const slot309Date = moment()
      .day(11)
      .hour(13)
      .minute(0)
      .second(0);
    const slots309 = [
      {
        ...getAppointmentSlotMock(),
        startDateTime: slot309Date.format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
        endDateTime: slot309Date
          .clone()
          .minute(20)
          .format('YYYY-MM-DDTHH:mm:ss[+00:00]'),
      },
    ];
    const preferredDate = moment();
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '308',
      typeOfCareId: '323',
      slots: slots308,
      preferredDate,
    });
    mockAppointmentSlotFetch({
      siteId: '983',
      clinicId: '309',
      typeOfCareId: '323',
      slots: slots309,
      preferredDate,
    });
    const store = createTestStore(initialState);
    await setTypeOfCare(store, /primary care/i);
    await setVAFacility(store, '983');
    await setClinic(store, /green team/i);
    await setPreferredDate(store, preferredDate);

    // First pass check to make sure the slots associated with green team are displayed
    let screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    await screen.findByText(/Next/);
    await waitFor(
      () =>
        expect(screen.queryByText('Finding appointment availability...')).to.not
          .exist,
    );
    const dayWithSlots = screen
      .getAllByText(slot308Date.date().toString())
      .find(
        node =>
          node.getAttribute('aria-label') ===
          slot308Date.format('dddd, MMMM Do'),
      );
    expect(dayWithSlots).to.exist;
    fireEvent.click(dayWithSlots);
    expect(await screen.findByText('9:00')).to.contain.text('9:00 a.m. AM');

    await cleanup();

    // Second pass make sure the slots associated with red team are displayed
    await setClinic(store, /red team/i);
    screen = renderWithStoreAndRouter(<DateTimeSelectPage />, {
      store,
    });

    await screen.findByText(/Next/);
    await waitFor(
      () =>
        expect(screen.queryByText('Finding appointment availability...')).to.not
          .exist,
    );
    const newDayWithSlots = screen
      .getAllByText(slot309Date.date().toString())
      .find(
        node =>
          node.getAttribute('aria-label') ===
          slot309Date.format('dddd, MMMM Do'),
      );
    expect(newDayWithSlots).to.exist;
    fireEvent.click(newDayWithSlots);
    expect(await screen.findByText('1:00')).to.contain.text('1:00 p.m. PM');
  });
});
