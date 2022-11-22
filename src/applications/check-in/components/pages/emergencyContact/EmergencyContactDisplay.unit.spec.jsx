import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { axeCheck } from '@department-of-veterans-affairs/platform-forms-systems/test/config/helpers';
import { I18nextProvider } from 'react-i18next';
import { scheduledDowntimeState } from '../../../tests/unit/utils/initState';
import i18n from '../../../utils/i18n/i18n';
import EmergencyContactDisplay from './EmergencyContactDisplay';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('EmergencyContactDisplay', () => {
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
              pages: [],
            },
          },
          ...scheduledDowntimeState,
        };
        store = mockStore(initState);
      });
      it('passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EmergencyContactDisplay />
            </I18nextProvider>
          </Provider>,
        );
      });
      it('renders with default values', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EmergencyContactDisplay />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('Is this your current emergency contact?')).to.exist;
      });

      it('renders emergency contact data', () => {
        const emergencyContact = {
          name: 'Bugs Bunny',
          workPhone: '5554445555',
          address: {
            street1: '123 Turtle Trail',
            street2: '',
            street3: '',
            city: 'Treetopper',
            state: 'Tennessee',
            zip: '101010',
          },
          relationship: 'Uncle',
          phone: '5552223333',
        };
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EmergencyContactDisplay emergencyContact={emergencyContact} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('Address')).to.exist;
        expect(getByText('Phone')).to.exist;
        expect(getByText('Work phone')).to.exist;
        expect(getByText('Name')).to.exist;
        expect(getByText('Relationship')).to.exist;
        expect(getByText('123 Turtle Trail')).to.exist;
        expect(getByText('Treetopper, Tennessee 10101')).to.exist;
        expect(getByText('555-222-3333')).to.exist;
        expect(getByText('555-444-5555')).to.exist;
        expect(getByText('Uncle')).to.exist;
      });

      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EmergencyContactDisplay yesAction={yesClick} />
            </I18nextProvider>
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <EmergencyContactDisplay noAction={noClick} />
            </I18nextProvider>
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
    });
  });
});
