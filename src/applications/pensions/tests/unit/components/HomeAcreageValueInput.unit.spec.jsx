import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import {
  $,
  $$,
} from '@department-of-veterans-affairs/platform-forms-system/ui';

import getData from '../../fixtures/mocks/mockStore';

import HomeAcreageValueInput from '../../../components/HomeAcreageValueInput';

describe('<HomeAcreageValueInput />', () => {
  const defaultProps = {
    goBack: () => {},
    goForward: () => {},
    setFormData: () => {},
    onReviewPage: false,
  };

  const middleware = [];
  const mockStore = configureStore(middleware);
  it('renders', () => {
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <HomeAcreageValueInput />
      </Provider>,
    );

    expect($$('va-text-input,input', container).length).to.equal(0);
    expect($$('va-number-input,input', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });
  it('should allow submit when currency is valid', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <HomeAcreageValueInput
          {...defaultProps}
          goForward={goForwardSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const input = container.querySelector('[name="home-acreage-value"]');

    await waitFor(() => expect(input.getAttribute('error')).to.equal(''));

    input.value = '250000.00';
    fireEvent.input(input);
    await waitFor(() => expect(input.value).to.equal('250000.00'));

    fireEvent.submit($('form', container));
    await waitFor(() => expect(goForwardSpy.calledOnce).to.be.true);
  });
  it('should not allow submit with non currency value', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <HomeAcreageValueInput
          {...defaultProps}
          goForward={goForwardSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const input = container.querySelector('[name="home-acreage-value"]');
    await waitFor(() => expect(input.getAttribute('error')).to.equal(''));

    input.value = 'not a currency value';

    fireEvent.input(input);
    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(input.value).to.equal('not a currency value');
      expect(input.getAttribute('error')).to.equal(
        'Please enter a valid dollar amount',
      );
      expect(goForwardSpy.called).to.be.false;
      expect(setFormDataSpy.called).to.be.false;
    });
  });
  it('should not allow submit with too many decimal points', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <HomeAcreageValueInput />
      </Provider>,
    );

    const input = container.querySelector('[name="home-acreage-value"]');
    await waitFor(() => expect(input.getAttribute('error')).to.equal(''));

    input.value = '250,000.001';

    fireEvent.input(input);
    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(input.value).to.equal('250,000.001');
      expect(input.getAttribute('error')).to.equal(
        'Please enter a valid dollar amount',
      );
      expect(goForwardSpy.called).to.be.false;
      expect(setFormDataSpy.called).to.be.false;
    });
  });
  it('should not allow submit when value is over max', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <HomeAcreageValueInput
          {...defaultProps}
          goForward={goForwardSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const input = container.querySelector('[name="home-acreage-value"]');
    await waitFor(() => expect(input.getAttribute('error')).to.equal(''));

    input.value = '25000000000';

    fireEvent.input(input);

    await waitFor(() => {
      expect(input.value).to.equal('25000000000');
      fireEvent.submit($('form', container));
      expect(input.getAttribute('error')).to.equal(
        'Please enter an amount less than $999,999,999',
      );
      expect(goForwardSpy.calledOnce).to.be.false;
      expect(setFormDataSpy.calledOnce).to.be.false;
    });
  });
});
