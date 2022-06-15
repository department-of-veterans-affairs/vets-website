import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import {
  singleAppointment,
  multipleAppointments,
} from '../../../../tests/unit/mocks/mock-appointments';
import Demographics from '../index';

import { createMockRouter } from '../../../../tests/unit/mocks/router';

describe('pre-check-in', () => {
  describe('Demographics page - current demographics', () => {
    let store;
    beforeEach(() => {
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
      };
      store = mockStore(initState);
    });
    it('page passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <Demographics router={createMockRouter()} />
        </Provider>,
      );
    });
  });
  describe('Demographics page - pending edits', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
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
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
          context: {
            pendingEdits: {
              demographics: {
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
                homePhone: '1231231234',
                mobilePhone: '5553334444',
                workPhone: '5554445555',
                emailAddress: 'updated@email.com',
              },
            },
          },
        },
      };
      store = mockStore(initState);
    });
    it('shows the pending edits instead of the old information', () => {
      const { getByText } = render(
        <Provider store={store}>
          <Demographics router={createMockRouter()} />
        </Provider>,
      );
      expect(getByText('updated@email.com')).to.exist;
    });
  });

  describe('Demographics sub message', () => {
    let store;
    const initState = {
      checkInData: {
        appointments: singleAppointment,
        context: {
          token: '',
        },
        form: {
          pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
        },
        veteranData: {
          demographics: {
            mailingAddress: {
              street1: '123 Turtle Trail',
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
      },
      featureToggles: {
        // eslint-disable-next-line camelcase
        check_in_experience_phone_appointments_enabled: false,
      },
    };
    const middleware = [];
    const mockStore = configureStore(middleware);
    beforeEach(() => {
      store = mockStore(initState);
    });
    it('renders the sub-message for an in-person appointment', () => {
      const component = render(
        <Provider store={store}>
          <Demographics router={createMockRouter()} />
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
      store = mockStore(phoneInitState);

      const component = render(
        <Provider store={store}>
          <Demographics router={createMockRouter()} />
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
