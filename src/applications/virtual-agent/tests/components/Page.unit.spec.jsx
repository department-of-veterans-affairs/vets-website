import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import * as UseChosenBotModule from '../../hooks/useChosenBot';

import Page, { renderPageContent } from '../../components/Page';
import FloatingBot from '../../components/FloatingBot';
import StickyBot from '../../components/StickyBot';

import * as StickyBotModule from '../../components/FloatingBot';
import * as FloatingBotModule from '../../components/StickyBot';

const getData = ({
  virtualAgentShowFloatingChatbot = null,
  chosenBot = '',
} = {}) => {
  return {
    props: {
      virtualAgentShowFloatingChatbot,
    },
    mockStore: {
      getState: () => ({
        featureToggles: [
          {
            [FEATURE_FLAG_NAMES.virtualAgentShowFloatingChatbot]: virtualAgentShowFloatingChatbot,
          },
        ],
        chosenBot,
      }),
      subscribe: () => {},
      dispatch: () => ({}),
    },
  };
};

describe('Page', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });
  describe('Page', () => {
    it('should set up the chosen bot hook', () => {
      const { props, mockStore } = getData();
      const useChosenBotStub = sandbox
        .stub(UseChosenBotModule, 'default')
        .returns(<div />);
      sandbox.stub(StickyBotModule, 'default');
      sandbox.stub(FloatingBotModule, 'default');

      render(
        <Provider store={mockStore}>
          <Page {...props} />
        </Provider>,
      );

      expect(useChosenBotStub.calledOnce).to.be.true;
    });
  });
  describe('renderPageContent', () => {
    it('renders loading indicator when isLoading is true', () => {
      const result = renderPageContent(true, 'sticky');
      expect(result).to.deep.equal(<va-loading-indicator />);
    });
    it('returns StickyBot when chosenBot is "sticky" and isLoading is false', () => {
      const result = renderPageContent(false, 'sticky');
      expect(result).to.deep.equal(<StickyBot />);
    });
    it('returns FloatingBot when chosenBot is "default" and isLoading is false', () => {
      const result = renderPageContent(false, 'default');
      expect(result).to.deep.equal(<FloatingBot />);
    });
    it('renders empty string when chosenBot is neither "sticky" nor "default" and isLoading is false', () => {
      const result = renderPageContent(false, 'other');
      expect(result).to.equal('');
    });
  });
});
