import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from '@department-of-veterans-affairs/platform-forms-systems/test/config/helpers';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../../../utils/i18n/i18n';
import { scheduledDowntimeState } from '../../../../tests/unit/utils/initState';
import { multipleAppointments } from '../../../../tests/unit/mocks/mock-appointments';
import Demographics from '../index';

import { createMockRouter } from '../../../../tests/unit/mocks/router';

const middleware = [];
const mockStore = configureStore(middleware);
const initState = {
  checkInData: {
    appointments: multipleAppointments,
    veteranData: {
      demographics: {
        nextOfKin1: {
          name: 'VETERAN,JONAH',
          relationship: 'BROTHER',
          phone: '1112223333',
          workPhone: '4445556666',
          address: {
            street1: '123 Main St',
            street2: 'Ste 234',
            street3: '',
            city: 'Los Angeles',
            county: 'Los Angeles',
            state: 'CA',
            zip: '90089',
            zip4: '',
            country: 'USA',
          },
        },
        mailingAddress: {
          street1: '123 Turtle Trail',
          street2: '',
          street3: '',
          city: 'Treetopper',
          state: 'Tennessee',
          zip: '101010',
        },
        homeAddress: {
          street1: '445 Fine Finch Fairway',
          street2: 'Apt 201',
          city: 'Fairfence',
          state: 'Florida',
          zip: '445545',
        },
        homePhone: '5552223333',
        mobilePhone: '5553334444',
        workPhone: '5554445555',
        emailAddress: 'kermit.frog@sesameenterprises.us',
      },
    },
    context: {},
    form: {
      pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
    },
  },
  featureToggles: {
    // eslint-disable-next-line camelcase
    check_in_experience_phone_appointments_enabled: false,
  },
};

describe('pre-check-in', () => {
  describe('Demographics page - current demographics', () => {
    const axeStore = mockStore({ ...initState, ...scheduledDowntimeState });

    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={axeStore}>
          <I18nextProvider i18n={i18n}>
            <Demographics router={createMockRouter()} />
          </I18nextProvider>
        </Provider>,
      );
    });
  });

  describe('Demographics sub message', () => {
    const subStore = mockStore({ ...initState, ...scheduledDowntimeState });

    it('renders the sub-message for an in-person appointment', () => {
      const component = render(
        <Provider store={subStore}>
          <I18nextProvider i18n={i18n}>
            <Demographics router={createMockRouter()} />
          </I18nextProvider>
        </Provider>,
      );
      expect(
        component.queryByText(
          'If you need to make changes, please talk to a staff member when you check in.',
        ),
      ).to.exist;
    });
    it('does not render the sub-message for a phone appointment appointment', () => {
      const phoneInitState = JSON.parse(JSON.stringify(initState));
      phoneInitState.checkInData.appointments[0].kind = 'phone';
      // eslint-disable-next-line camelcase
      phoneInitState.featureToggles.check_in_experience_phone_appointments_enabled = true;
      const phoneSubStore = mockStore({
        ...phoneInitState,
        ...scheduledDowntimeState,
      });
      const component = render(
        <Provider store={phoneSubStore}>
          <I18nextProvider i18n={i18n}>
            <Demographics router={createMockRouter()} />
          </I18nextProvider>
        </Provider>,
      );
      expect(
        component.queryByText(
          'If you need to make changes, please talk to a staff member when you check in.',
        ),
      ).not.to.exist;
    });
  });
});
