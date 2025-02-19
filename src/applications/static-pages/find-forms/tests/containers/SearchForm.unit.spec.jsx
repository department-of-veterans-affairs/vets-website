import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render, waitFor } from '@testing-library/react';
import { SearchForm } from '../../containers/SearchForm';
import * as api from '../../api';

const apiStub = sinon.stub(api, 'fetchFormsApi');
const mockStore = configureStore([]);
const store = mockStore({ findVAFormsReducer: { fetching: false } });

describe('Find VA Forms <SearchForm>', () => {
  const oldLocation = global.window.location;

  afterEach(() => {
    global.window.location = oldLocation;
    apiStub.resetHistory();
  });

  it('should fetch data on mount when a search query is added', async () => {
    global.window.location = { search: '?q=health' };

    const { queryByTestId } = render(
      <Provider store={store}>
        <SearchForm />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiStub.called).to.be.true;
      expect(apiStub.calledWith('health')).to.be.true;
      expect(queryByTestId(/find-form-error-body/i)).to.be.null;
    });
  });

  it('should not fetch data when there is no search query', async () => {
    global.window.location = { search: '?q=' };

    const { queryByTestId } = render(
      <Provider store={store}>
        <SearchForm />
      </Provider>,
    );

    await waitFor(() => {
      expect(queryByTestId(/find-form-error-body/i)).to.be.null;
      expect(apiStub.called).to.be.false;
    });
  });

  it('should not fetch data and show an error when there is only 1 character search query', async () => {
    global.window.location = { search: '?q=a' };

    const { queryByTestId } = render(
      <Provider store={store}>
        <SearchForm />
      </Provider>,
    );

    await waitFor(() => {
      expect(apiStub.called).to.be.false;
      expect(queryByTestId(/find-form-error-body/i)).not.to.be.null;
      expect(queryByTestId(/find-form-error-body/i)).to.be.visible;
      expect(queryByTestId(/find-form-error-message/i)).to.be.visible;
    });
  });
});
