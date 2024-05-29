import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { add } from 'date-fns';
import { expect } from 'chai';
import sinon from 'sinon';

import { requestStates } from '~/platform/utilities/constants';
import { mockApiRequest, resetFetch } from '~/platform/testing/unit/helpers';
import { $, $$ } from '~/platform/forms-system/src/js/utilities/ui';

import ITFWrapper from '../../containers/ITFWrapper';
import { ITF_STATUSES } from '../../constants';
import itfFetchResponse from '../fixtures/mocks/intent-to-file.json';
import itfCreateResponse from '../fixtures/mocks/intent-to-file-compensation.json';

import { getReadableDate } from '../../../shared/utils/dates';

const getData = ({
  loggedIn = true,
  pathname = '/middle',
  benefitType = 'compensation',
  mockDispatch = null,
  fetchCallState = requestStates.notCalled,
  creationCallState = requestStates.notCalled,
  currentITF = null,
  previousITF = null,
} = {}) => ({
  props: {
    loggedIn,
    benefitType,
    pathname,
    mockDispatch,
  },
  mockStore: {
    getState: () => ({
      itf: {
        fetchCallState,
        creationCallState,
        currentITF,
        previousITF,
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('ITFWrapper', () => {
  afterEach(() => {
    resetFetch();
  });
  describe('No ITF API call made', () => {
    it('should not make an api call if not logged in', () => {
      mockApiRequest();
      const mockDispatch = sinon.spy();
      const { props, mockStore } = getData({
        loggedIn: false,
        mockDispatch,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ITFWrapper {...props}>
            <p>It worked!</p>
          </ITFWrapper>
        </Provider>,
      );
      expect(mockDispatch.called).to.be.false;
      expect(container.textContent).to.contain('It worked!');
    });
    it('should not make an api call for non-compensation/non-pension benefit types', () => {
      mockApiRequest();
      const mockDispatch = sinon.spy();
      const { props, mockStore } = getData({
        benefitType: 'unknown',
        mockDispatch,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ITFWrapper {...props}>
            <p>It worked!</p>
          </ITFWrapper>
        </Provider>,
      );
      expect(mockDispatch.called).to.be.false;
      expect(container.textContent).to.contain('It worked!');
    });
    it('should not make an api call on the start page', () => {
      mockApiRequest();
      const mockDispatch = sinon.spy();
      const { props, mockStore } = getData({
        pathname: '/start',
        mockDispatch,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ITFWrapper {...props}>
            <p>It worked!</p>
          </ITFWrapper>
        </Provider>,
      );
      expect(mockDispatch.called).to.be.false;
      expect(container.textContent).to.contain('It worked!');
    });
    it('should not make an api call on the intro page', () => {
      mockApiRequest();
      const mockDispatch = sinon.spy();
      const { props, mockStore } = getData({
        pathname: '/introduction',
        mockDispatch,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ITFWrapper {...props}>
            <p>It worked!</p>
          </ITFWrapper>
        </Provider>,
      );
      expect(mockDispatch.called).to.be.false;
      expect(container.textContent).to.contain('It worked!');
    });
    it('should not make an api call on the intro page with a trailing slash', () => {
      mockApiRequest();
      const mockDispatch = sinon.spy();
      const { props, mockStore } = getData({
        pathname: '/introduction/',
        mockDispatch,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ITFWrapper {...props}>
            <p>It worked!</p>
          </ITFWrapper>
        </Provider>,
      );
      expect(mockDispatch.called).to.be.false;
      expect(container.textContent).to.contain('It worked!');
    });
    it('should not make an api call on the confirmation page', () => {
      mockApiRequest();
      const mockDispatch = sinon.spy();
      const { props, mockStore } = getData({
        pathname: '/confirmation',
        mockDispatch,
      });
      const { container } = render(
        <Provider store={mockStore}>
          <ITFWrapper {...props}>
            <p>It worked!</p>
          </ITFWrapper>
        </Provider>,
      );
      expect(mockDispatch.called).to.be.false;
      expect(container.textContent).to.contain('It worked!');
    });
  });

  it('should fetch the ITF if the form is loaded not on the intro or confirmation pages', () => {
    mockApiRequest();
    const mockDispatch = sinon.spy();
    const { props, mockStore } = getData({ mockDispatch });
    render(
      <Provider store={mockStore}>
        <ITFWrapper {...props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    expect(mockDispatch.called).to.be.true;
  });

  it('should fetch the ITF if the form is loaded on the intro and navigated to the next page', async () => {
    mockApiRequest();
    const mockDispatch = sinon.spy();
    const { props, mockStore } = getData({
      pathname: '/introduction',
      mockDispatch,
    });
    const { rerender } = render(
      <Provider store={mockStore}>
        <ITFWrapper {...props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    expect(mockDispatch.called).to.be.false;
    await rerender(
      <Provider store={mockStore}>
        <ITFWrapper {...props} pathname="/middle">
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    await waitFor(() => {
      expect(mockDispatch.called).to.be.true;
    });
  });

  it('should render a loading indicator', async () => {
    mockApiRequest();
    const mockDispatch = sinon.spy();
    const data = getData({ mockDispatch });
    const { rerender, container } = render(
      <Provider store={data.mockStore}>
        <ITFWrapper {...data.props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    expect($$('va-loading-indicator', container).length).to.eq(1);
    const newData = getData({ fetchCallState: requestStates.pending });
    await rerender(
      <Provider store={newData.mockStore}>
        <ITFWrapper {...newData.props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    await waitFor(() => {
      expect($$('va-loading-indicator', container).length).to.eq(1);
    });
  });

  it('should render an info message if the ITF fetch failed', () => {
    mockApiRequest(null, false);
    const { props, mockStore } = getData({
      fetchCallState: requestStates.failed,
    });
    const { container } = render(
      <Provider store={mockStore}>
        <ITFWrapper {...props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    expect($('va-alert h2', container).textContent).to.contain(
      'We can’t confirm if we have an intent to file on record for you right now',
    );
  });

  it('should submit a new ITF if the fetch failed', () => {
    mockApiRequest(itfCreateResponse);
    const mockDispatch = sinon.spy();
    const { props, mockStore } = getData({
      fetchCallState: requestStates.failed,
      mockDispatch,
    });
    render(
      <Provider store={mockStore}>
        <ITFWrapper {...props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    expect(mockDispatch.called).to.be.true;
  });

  it('should submit a new ITF if no active ITF is found', async () => {
    const mockData = {
      data: {
        id: '',
        type: 'evss_intent_to_file_intent_to_files_responses',
        attributes: {
          intentToFile: [],
        },
      },
    };
    mockApiRequest(mockData);
    const data = getData();
    const { rerender } = render(
      <Provider store={data.mockStore}>
        <ITFWrapper {...data.props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    // Fetch succeeded, but no ITFs were returned
    const mockDispatch = sinon.spy();
    const newData = getData({
      fetchCallState: requestStates.succeeded,
      mockDispatch,
    });
    await rerender(
      <Provider store={newData.mockStore}>
        <ITFWrapper {...newData.props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    await waitFor(() => {
      expect(mockDispatch.called).to.be.true;
    });
  });

  it('should submit a new ITF if the current ITF is expired', async () => {
    mockApiRequest(itfFetchResponse);
    const data = getData();
    const { rerender } = render(
      <Provider store={data.mockStore}>
        <ITFWrapper {...data.props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    // Fetch succeeded, but no ITFs were returned
    const mockDispatch = sinon.spy();
    const expirationDate = add(new Date(), { days: -1 });
    const newData = getData({
      fetchCallState: requestStates.succeeded,
      mockDispatch,
      currentITF: {
        status: 'active',
        expirationDate: expirationDate.toISOString(),
      },
    });
    await rerender(
      <Provider store={newData.mockStore}>
        <ITFWrapper {...newData.props}>
          <p>Shouldn’t see me yet...</p>
        </ITFWrapper>
      </Provider>,
    );
    // Fetch succeeded and expired ITF was returned
    // This is used to catch cases where the status field is out of date
    await waitFor(() => {
      expect(mockDispatch.called).to.be.true;
    });
  });

  it('should render an info message if the ITF creation failed', () => {
    mockApiRequest(null, false);
    const data = getData({
      fetchCallState: requestStates.succeeded,
      // But no ITF is found
      creationCallState: requestStates.failed,
    });
    const { container } = render(
      <Provider store={data.mockStore}>
        <ITFWrapper {...data.props}>
          <p>I'm a ninja; you can’t see me!</p>
        </ITFWrapper>
      </Provider>,
    );
    expect($('va-alert h2', container).textContent).to.contain(
      'We can’t confirm if we have an intent to file on record for you right now',
    );
  });

  it('should render a success message for fetched ITF', () => {
    const expirationDate = add(new Date(), { days: 1 });
    mockApiRequest();
    const data = getData({
      fetchCallState: requestStates.succeeded,
      currentITF: {
        status: ITF_STATUSES.active,
        expirationDate: expirationDate.toISOString(),
      },
    });
    const { container } = render(
      <Provider store={data.mockStore}>
        <ITFWrapper {...data.props}>
          <p>Hello, world.</p>
        </ITFWrapper>
      </Provider>,
    );
    expect($('va-alert h2', container).textContent).to.contain(
      'You already have an Intent to File',
    );
    const date = getReadableDate(expirationDate);
    expect($('va-alert').innerHTML).to.contain(date);
  });

  it('should render a success message for newly created ITF', () => {
    const expirationDate = add(new Date(), { days: 1 });
    const previousExpirationDate = add(new Date(), { days: -1 });

    mockApiRequest();
    const data = getData({
      fetchCallState: requestStates.succeeded,
      currentITF: {
        status: ITF_STATUSES.active,
        expirationDate: expirationDate.toISOString(),
      },
      creationCallState: requestStates.succeeded,
      previousITF: {
        expirationDate: previousExpirationDate.toISOString(),
      },
    });
    const { container } = render(
      <Provider store={data.mockStore}>
        <ITFWrapper {...data.props}>
          <p>Hello, world.</p>
        </ITFWrapper>
      </Provider>,
    );

    expect($('va-alert h2', container).textContent).to.contain(
      'You submitted an Intent to File',
    );
    const html = $('va-alert').innerHTML;
    expect(html).to.contain(getReadableDate(expirationDate));
    expect(html).to.contain(getReadableDate(previousExpirationDate));
  });
});
