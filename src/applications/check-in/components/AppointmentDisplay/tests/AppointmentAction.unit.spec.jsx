import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import MockDate from 'mockdate';

import { axeCheck } from 'platform/forms-system/test/config/helpers';

import AppointmentAction from '../AppointmentAction';
import i18n from '../../../utils/i18n/i18n';

import { ELIGIBILITY } from '../../../utils/appointment/eligibility';

describe('check-in', () => {
  afterEach(() => {
    MockDate.reset();
  });

  describe('AppointmentAction', () => {
    let store;
    beforeEach(() => {
      const middleware = [];
      const mockStore = configureStore(middleware);
      const initState = {
        checkInData: {
          context: {
            token: '',
          },
          form: {
            pages: ['first-page', 'second-page', 'third-page', 'fourth-page'],
          },
        },
      };
      store = mockStore(initState);
    });

    it('should render the bad status message for appointments with INELIGIBLE_BAD_STATUS status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction appointment={{}} />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('no-status-given-message')).to.exist;
      expect(action.getByTestId('no-status-given-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the check in button for ELIGIBLE appointments status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });

    it('should render the bad status message for appointments with INELIGIBLE_BAD_STATUS status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_BAD_STATUS,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('ineligible-bad-status-message')).to.exist;
      expect(action.getByTestId('ineligible-bad-status-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_UNSUPPORTED_LOCATION status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_UNSUPPORTED_LOCATION,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('unsupported-location-message')).to.exist;
      expect(action.getByTestId('unsupported-location-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_UNKNOWN_REASON status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_UNKNOWN_REASON,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('unknown-reason-message')).to.exist;
      expect(action.getByTestId('unknown-reason-message')).to.have.text(
        'Online check-in isn’t available for this appointment. Check in with a staff member.',
      );
    });
    it('should render the check in button for appointments with ELIGIBLE status that expire in more than 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:49-04:00');
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                checkInWindowEnd: '2018-01-01T12:15:00-04:00',
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.getByTestId('check-in-button')).to.exist;
      expect(action.getByTestId('check-in-button')).to.have.text(
        'Check in now',
      );
    });

    it('should render the bad status message for appointments with ELIGIBLE status that expire in the next 10 seconds', () => {
      MockDate.set('2018-01-01T12:14:51-04:00');
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                checkInWindowEnd: '2018-01-01T12:15:00-04:00',
                eligibility: ELIGIBILITY.ELIGIBLE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      MockDate.set('2018-01-01T12:14:51-04:00');
      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('too-late-message')).to.exist;
      expect(action.getByTestId('too-late-message')).to.have.text(
        'Your appointment started more than 15 minutes ago. We can’t check you in online. Ask a staff member for help.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_TOO_LATE status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_TOO_LATE,
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('too-late-message')).to.exist;
      expect(action.getByTestId('too-late-message')).to.have.text(
        'Your appointment started more than 15 minutes ago. We can’t check you in online. Ask a staff member for help.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_TOO_EARLY status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_TOO_EARLY,
                checkInWindowStart: '2021-07-19T14:00:00',
                startTime: '2021-07-19T14:30:00',
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('too-early-message')).to.exist;
      expect(action.getByTestId('too-early-message')).to.have.text(
        'You can check in starting at this time: 2:00 p.m.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
                checkedInTime: '2021-07-19T14:14:00',
                startTime: '2021-07-19T14:30:00',
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('already-checked-in-message')).to.exist;
      expect(action.getByTestId('already-checked-in-message')).to.have.text(
        'You checked in at 2:14 p.m.',
      );
    });
    it('should render the bad status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status and no checked in time', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,

                startTime: '2021-07-19T14:30:00',
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('already-checked-in-no-time-message')).to.exist;
      expect(
        action.getByTestId('already-checked-in-no-time-message'),
      ).to.have.text('You are already checked in.');
    });

    it('should render the bad status message for appointments with INELIGIBLE_ALREADY_CHECKED_IN status and an invalid date time', () => {
      const action = render(
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <AppointmentAction
              appointment={{
                eligibility: ELIGIBILITY.INELIGIBLE_ALREADY_CHECKED_IN,
                checkedInTime: 'Invalid DateTime',
                startTime: '2021-07-19T14:30:00',
              }}
            />
          </I18nextProvider>
        </Provider>,
      );

      expect(action.queryByTestId('check-in-button')).to.not.exist;
      expect(action.getByTestId('already-checked-in-no-time-message')).to.exist;
      expect(
        action.getByTestId('already-checked-in-no-time-message'),
      ).to.have.text('You are already checked in.');
    });

    it('check in button passes axeCheck', () => {
      axeCheck(
        <Provider store={store}>
          <AppointmentAction
            appointment={{
              eligibility: ELIGIBILITY.ELIGIBLE,
            }}
          />
        </Provider>,
      );
    });
  });
});
