import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import reducer from '../../../reducers/index';
import * as selectors from '../../../selectors';
import ClaimLetterList from '../../../components/ClaimLetterList';
import YourClaimLetters from '../../../containers/YourClaimLetters';
import NoLettersContent from '../../../containers/YourClaimLetters/errorComponents/NoLettersContent';
import ServerErrorContent from '../../../containers/YourClaimLetters/errorComponents/ServerErrorContent';
import UnauthenticatedContent from '../../../containers/YourClaimLetters/errorComponents/UnauthenticatedContent';
import WIP from '../../../components/WIP';

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
    it('should render a helpful message if there are no letters', () => {
      getClaimLettersStub.resolves([]);

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const noLetters = wrapper.find(<NoLettersContent />);

      expect(noLetters).to.exist;

      wrapper.unmount();
    });

    it('should render a rollout message if the showLetters feature flag is false', () => {
      showLettersFeatureStub.returns(false);
      getClaimLettersStub.resolves([]);

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const wip = wrapper.find(<WIP />);

      expect(wip).to.exist;

      wrapper.unmount();
    });

    it('should render a message alerting the user to a problem if unable to retrieve letters', () => {
      getClaimLettersStub.rejects({ errors: [{ code: 500 }] });

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const serverError = wrapper.find(<ServerErrorContent />);
      expect(serverError).to.exist;

      wrapper.unmount();
    });

    it('should render a message alerting the user that they are unauthenticated', () => {
      getClaimLettersStub.rejects({ status: 401 });

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const serverError = wrapper.find(<UnauthenticatedContent />);

      expect(serverError).to.exist;

      wrapper.unmount();
    });

    it('should render a message alerting the user that they are unauthorized', () => {
      getClaimLettersStub.rejects({ status: 403 });

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const serverError = wrapper.find(<UnauthenticatedContent />);

      expect(serverError).to.exist;

      wrapper.unmount();
    });
  });

  context('a list of letters', () => {
    it('should render a list of letters with no pagination', () => {
      getClaimLettersStub.resolves([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const lettersList = wrapper.find(<ClaimLetterList />);

      expect(lettersList).to.exist;

      wrapper.unmount();
    });

    it('should render a list of letters with pagination', () => {
      getClaimLettersStub.resolves([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const lettersList = wrapper.find(<ClaimLetterList />);
      const pagination = wrapper.find(<VaPagination />);

      expect(lettersList).to.exist;
      expect(pagination).to.exist;

      wrapper.unmount();
    });
  });

  context('loading', () => {
    it('displays a loading message if feature flag is loading', () => {
      getClaimLettersStub.resolves([]);
      isLoadingFeaturesStub.returns(true);

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const loader = wrapper.find(<va-loading-indicator />);

      expect(loader).to.exist;

      wrapper.unmount();
    });
  });
});
