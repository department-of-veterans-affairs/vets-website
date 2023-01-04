/* eslint-disable @department-of-veterans-affairs/telephone-contact-digits */

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
import NoLettersContent from '../../../containers/errorComponents/NoLettersContent';
import ServerErrorContent from '../../../containers/errorComponents/ServerErrorContent';
import UnauthenticatedContent from '../../../containers/errorComponents/UnauthenticatedContent';
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

      wrapper.unmount();

      expect(noLetters).to.exist;
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

      wrapper.unmount();

      expect(wip).to.exist;
    });

    it('should render a message alerting the user to a problem if unable to retrieve letters', () => {
      getClaimLettersStub.rejects({ status: 500 });

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const serverError = wrapper.find(<ServerErrorContent />);

      wrapper.unmount();

      expect(serverError).to.exist;
    });

    it('should render a message alerting the user that they are unauthenticated', () => {
      getClaimLettersStub.rejects({ status: 401 });

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const serverError = wrapper.find(<UnauthenticatedContent />);

      wrapper.unmount();

      expect(serverError).to.exist;
    });

    it('should render a message alerting the user that they are unauthorized', () => {
      getClaimLettersStub.rejects({ status: 403 });

      const wrapper = mount(
        <Provider store={store}>
          <YourClaimLetters />
        </Provider>,
      );

      const serverError = wrapper.find(<UnauthenticatedContent />);

      wrapper.unmount();

      expect(serverError).to.exist;
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

      wrapper.unmount();

      expect(lettersList).to.exist;
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

      wrapper.unmount();

      expect(lettersList).to.exist;
      expect(pagination).to.exist;
    });
  });
});
