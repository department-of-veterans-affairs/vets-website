import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { axeCheck } from 'platform/forms-system/test/config/helpers';
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
              editing: {},
            },
            form: {},
          },
        };
        store = mockStore(initState);
      });
      it('passes axeCheck', () => {
        axeCheck(
          <Provider store={store}>
            <NextOfKinDisplay />
          </Provider>,
        );
      });
      it('renders with default values', () => {
        const { getByText } = render(
          <Provider store={store}>
            <NextOfKinDisplay />
          </Provider>,
        );

        expect(getByText('Is this your current next of kin information?')).to
          .exist;
      });
      it('renders the footer if footer is supplied', () => {
        const { getByText } = render(
          <Provider store={store}>
            {/* eslint-disable-next-line react/jsx-no-bind */}
            <NextOfKinDisplay Footer={() => <div>foo</div>} />
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom header', () => {
        const { getByText } = render(
          <Provider store={store}>
            <NextOfKinDisplay header="foo" />
          </Provider>,
        );
        expect(getByText('foo')).to.exist;
      });
      it('renders custom subtitle', () => {
        const { getByText } = render(
          <Provider store={store}>
            <NextOfKinDisplay subtitle="foo" />
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
            <NextOfKinDisplay nextOfKin={nextOfKinData} />
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
            <NextOfKinDisplay nextOfKin={nextOfKinData} />
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
            <NextOfKinDisplay yesAction={yesClick} />
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('yes-button'));
        expect(yesClick.calledOnce).to.be.true;
      });
      it('fires the no function', () => {
        const noClick = sinon.spy();
        const screen = render(
          <Provider store={store}>
            <NextOfKinDisplay noAction={noClick} />
          </Provider>,
        );
        fireEvent.click(screen.getByTestId('no-button'));
        expect(noClick.calledOnce).to.be.true;
      });
      it('renders the loading message', () => {
        const screen = render(
          <Provider store={store}>
            <NextOfKinDisplay isLoading />
          </Provider>,
        );
        expect(screen.queryByTestId('no-button')).to.not.exist;
        expect(screen.queryByTestId('yes-button')).to.not.exist;
        expect(screen.getByTestId('loading-message')).to.exist;
      });
      it('renders the buttons', () => {
        const screen = render(
          <Provider store={store}>
            <NextOfKinDisplay isLoading={false} />
          </Provider>,
        );
        expect(screen.getByTestId('no-button')).to.exist;
        expect(screen.getByTestId('yes-button')).to.exist;
      });
    });
  });
});
