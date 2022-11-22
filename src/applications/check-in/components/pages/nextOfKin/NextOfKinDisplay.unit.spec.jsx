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
import NextOfKinDisplay from './NextOfKinDisplay';

describe('pre-check-in experience', () => {
  describe('shared components', () => {
    describe('NextOfKinDisplay', () => {
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
              <NextOfKinDisplay />
            </I18nextProvider>
          </Provider>,
        );
      });
      it('renders with default values', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay />
            </I18nextProvider>
          </Provider>,
        );

        expect(getByText('Is this your current next of kin information?')).to
          .exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay header="foo" />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay subtitle="foo" />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders next of kin labels', () => {
        const nextOfKinData = {
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
        };
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay nextOfKin={nextOfKinData} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('Name')).to.exist;
        expect(getByText('Relationship')).to.exist;
        expect(getByText('Address')).to.exist;
        expect(getByText('Phone')).to.exist;
        expect(getByText('Work phone')).to.exist;
      });
      it('renders next of kin values', () => {
        const nextOfKinData = {
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
        };
        const { getByText } = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay nextOfKin={nextOfKinData} />
            </I18nextProvider>
          </Provider>,
        );
        expect(getByText('VETERAN,JONAH')).to.exist;
        expect(getByText('BROTHER')).to.exist;
        expect(getByText('111-222-3333')).to.exist;
        expect(getByText('444-555-6666')).to.exist;
        expect(getByText('123 Main St')).to.exist;
        expect(getByText(', Ste 234')).to.exist;
        expect(getByText('Los Angeles, CA 90089')).to.exist;
      });
      it('fires the yes function', () => {
        const yesClick = sinon.spy();
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay yesAction={yesClick} />
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
              <NextOfKinDisplay noAction={noClick} />
            </I18nextProvider>
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
      it('renders the loading message', () => {
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay isLoading />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.queryByTestId('no-button')).to.not.exist;
        expect(screen.queryByTestId('yes-button')).to.not.exist;
        expect(screen.getByTestId('loading-message')).to.exist;
      });
      it('renders the buttons', () => {
        const screen = render(
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <NextOfKinDisplay isLoading={false} />
            </I18nextProvider>
          </Provider>,
        );
        expect(screen.getByTestId('no-button')).to.exist;
        expect(screen.getByTestId('yes-button')).to.exist;
      });
    });
  });
});
