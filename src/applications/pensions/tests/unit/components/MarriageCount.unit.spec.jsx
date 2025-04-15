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

import MarriageCount from '../../../components/MarriageCount';

describe('Marriage count component', () => {
  const defaultProps = {
    data: { marriages: [] },
    goBack: () => {},
    goForward: () => {},
    setFormData: () => {},
  };

  const middleware = [];
  const mockStore = configureStore(middleware);
  it('renders', () => {
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <MarriageCount {...defaultProps} />
      </Provider>,
    );

    expect($$('va-text-input,input', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });
  it('should not submit empty form', async () => {
    const goForwardSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <MarriageCount {...defaultProps} goForward={goForwardSpy} />
      </Provider>,
    );
    const input = container.querySelector('[name="root_marriage_count_value"]');

    fireEvent.submit($('form', container));

    await waitFor(() => {
      expect(input.getAttribute('error')).to.equal(
        'You must enter at least 1 marriage',
      );
      expect(goForwardSpy.calledOnce).not.to.be.true;
    });
  });
  it('should not allow submit when count is over max', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <MarriageCount
          {...defaultProps}
          goForward={goForwardSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );
    const input = container.querySelector('[name="root_marriage_count_value"]');

    await waitFor(() => expect(input.getAttribute('error')).to.equal(null));

    input.value = '11';
    fireEvent.input(input);
    await waitFor(() => expect(input.value).to.equal('11'));

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(input.getAttribute('error')).to.equal(
        'Please enter a number between 1 and 10',
      );
      expect(goForwardSpy.calledOnce).not.to.be.true;
    });
  });
  it('should allow submit when count is valid', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const { data } = getData({ loggedIn: false });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <MarriageCount
          {...defaultProps}
          goForward={goForwardSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );
    const input = container.querySelector('[name="root_marriage_count_value"]');

    await waitFor(() => expect(input.getAttribute('error')).to.equal(null));

    input.value = '1';
    fireEvent.input(input);
    await waitFor(() => expect(input.value).to.equal('1'));

    fireEvent.submit($('form', container));
    await waitFor(() => {
      expect(goForwardSpy.calledOnce).to.be.true;
      // assert that data equals { marriages: [{}] }
    });
  });
  it('should initialize count to 2 when there are 2 marriages in data', async () => {
    const goForwardSpy = sinon.spy();
    const setFormDataSpy = sinon.spy();
    const initialData = {
      marriages: [{ id: 1, spouse: 'Alice' }, { id: 2, spouse: 'Bob' }],
    };
    const { data } = getData({ loggedIn: false, formData: initialData });
    const store = mockStore(data);
    const { container } = render(
      <Provider store={store}>
        <MarriageCount
          {...defaultProps}
          data={initialData}
          goForward={goForwardSpy}
          setFormData={setFormDataSpy}
        />
      </Provider>,
    );

    const input = container.querySelector(
      'va-text-input[name="root_marriage_count_value"]',
    );
    expect(input).to.exist;

    await waitFor(() => {
      expect(input.getAttribute('value')).to.equal('2');
    });
  });
});
