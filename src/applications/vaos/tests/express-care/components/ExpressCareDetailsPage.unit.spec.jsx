import React from 'react';
import MockDate from 'mockdate';
import { expect } from 'chai';
import moment from 'moment';

import { mockFetch, resetFetch } from 'platform/testing/unit/helpers';
import { waitFor } from '@testing-library/dom';

import { getExpressCareRequestCriteriaMock } from '../../mocks/v0';
import { createTestStore, renderWithStoreAndRouter } from '../../mocks/setup';
import { mockRequestEligibilityCriteria } from '../../mocks/helpers';
import { NewExpressCareRequest } from '../../../express-care';
import ExpressCareDetailsPage from '../../../express-care/components/ExpressCareDetailsPage';
import { fetchExpressCareWindows } from '../../../appointment-list/redux/actions';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingExpressCareNew: true,
  },
  user: {
    profile: {
      facilities: [{ facilityId: '983', isCerner: false }],
    },
  },
  expressCare: {
    newRequest: {
      data: {
        reason: 'Cough',
      },
      pages: {},
    },
  },
};

describe('VAOS integration: Express Care form - Additional Appointment detail', () => {
  beforeEach(() => {
    mockFetch();
    MockDate.set(moment('2020-01-26T14:00:00'));
  });
  afterEach(() => {
    resetFetch();
    MockDate.reset();
  });

  it('should contain expected form elements', async () => {
    const today = moment();
    const requestCriteria = getExpressCareRequestCriteriaMock('983', [
      {
        day: today
          .clone()
          .tz('America/Denver')
          .format('dddd')
          .toUpperCase(),
        canSchedule: true,
        startTime: today
          .clone()
          .subtract('2', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
        endTime: today
          .clone()
          .add('1', 'minutes')
          .tz('America/Denver')
          .format('HH:mm'),
      },
    ]);
    mockRequestEligibilityCriteria(['983'], [requestCriteria]);
    const store = createTestStore({
      ...initialState,
    });
    store.dispatch(fetchExpressCareWindows());

    const screen = renderWithStoreAndRouter(<ExpressCareDetailsPage />, {
      store,
    });

    await screen.findByText(/tell us about your cough/i);

    expect(screen.baseElement).to.contain.text(
      'Please provide additional details about your symptoms',
    );
    expect(screen.baseElement).to.contain.text(
      'Please provide your phone number and email address where VA health care staff can contact you',
    );
    expect(screen.getByText(/go to your profile/i).href).to.include('/profile');
    screen.getByLabelText(/phone number/i);
    screen.getByLabelText(/email address/i);
    screen.getByText(/submit express care request/i);
  });

  it('should redirect to info page when starting on Appointment detail', async () => {
    const store = createTestStore({
      ...initialState,
      expressCare: {
        newRequest: {
          data: {},
          pages: {},
        },
      },
    });
    const today = moment();
    mockRequestEligibilityCriteria(
      ['983'],
      [
        getExpressCareRequestCriteriaMock('983', [
          {
            day: today
              .clone()
              .tz('America/Denver')
              .format('dddd')
              .toUpperCase(),
            canSchedule: true,
            startTime: today
              .clone()
              .subtract('2', 'minutes')
              .tz('America/Denver')
              .format('HH:mm'),
            endTime: today
              .clone()
              .add('1', 'minutes')
              .tz('America/Denver')
              .format('HH:mm'),
          },
        ]),
      ],
    );

    const { history } = renderWithStoreAndRouter(<NewExpressCareRequest />, {
      store,
      path: '/additional-details',
    });

    await waitFor(() =>
      expect(history.location.pathname).to.equal('/new-express-care-request'),
    );
  });
});
