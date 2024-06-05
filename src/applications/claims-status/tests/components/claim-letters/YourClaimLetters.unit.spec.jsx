import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';

import reducer from '../../../reducers/index';
import * as selectors from '../../../selectors';

import YourClaimLetters from '../../../containers/YourClaimLetters';
import { renderWithRouter } from '../../utils';

const actions = require('../../../actions/index');

describe('<YourClaimLetters>', () => {
  let store;
  let showLettersFeatureStub;
  let isLoadingFeaturesStub;
  let getClaimLettersStub;

  before(() => {
    store = createStore(reducer.disability);
  });

  beforeEach(() => {
    showLettersFeatureStub = sinon
      .stub(selectors, 'showClaimLettersFeature')
      .returns(true);
    isLoadingFeaturesStub = sinon
      .stub(selectors, 'isLoadingFeatures')
      .returns(false);
    getClaimLettersStub = sinon.stub(actions, 'getClaimLetters');
  });

  afterEach(() => {
    showLettersFeatureStub.restore();
    isLoadingFeaturesStub.restore();
    getClaimLettersStub.restore();
  });

  context('cannot show claims', () => {
    it('should render a helpful message if there are no letters', async () => {
      getClaimLettersStub.resolves([]);

      const { findByText } = renderWithRouter(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      await findByText('No claim letters');
    });

    it('should render a rollout message if the showLetters feature flag is false', async () => {
      showLettersFeatureStub.returns(false);
      getClaimLettersStub.resolves([]);

      const { findByText } = renderWithRouter(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      await findByText('fixing some problems', { exact: false });
    });

    it('should render a message alerting the user to a problem if unable to retrieve letters', async () => {
      getClaimLettersStub.rejects({ errors: [{ code: 500 }] });

      const { findByText } = renderWithRouter(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      await findByText('try again later', { exact: false });
    });

    it('should render a message alerting the user that they are unauthenticated', async () => {
      getClaimLettersStub.rejects({ status: 401 });

      const { findByText } = renderWithRouter(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      await findByText('signed in', { exact: false });
    });

    it('should render a message alerting the user that they are unauthorized', async () => {
      getClaimLettersStub.rejects({ status: 403 });

      const { findByText } = renderWithRouter(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      await findByText('signed in', { exact: false });
    });
  });

  context('a list of letters', () => {
    it('should render a list of letters with no pagination', async () => {
      getClaimLettersStub.resolves([
        {
          docType: '1',
          receivedAt: '2023-01-09',
          documentId: 'abc',
        },
      ]);

      const { findByText } = renderWithRouter(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      await findByText('2023 letter', { exact: false });
    });
  });
});
