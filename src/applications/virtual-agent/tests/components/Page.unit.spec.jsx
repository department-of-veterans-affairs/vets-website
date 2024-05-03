import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import * as Disclaimer from '../../components/Disclaimer';
import * as Chatbox from '../../components/Chatbox';
import * as useChosenBot from '../../hooks/useChosenBot';

import Page from '../../components/Page';

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
            // eslint-disable-next-line camelcase
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

  it('renders the loading indicator', () => {
    sandbox.stub(Chatbox, 'default').returns(<div className="chatbox" />);
    sandbox.stub(Disclaimer, 'default').returns(<div className="disclaimer" />);
    sandbox.stub(useChosenBot, 'default');

    const { props, mockStore } = getData();

    const { container } = render(
      <Provider store={mockStore}>
        <Page {...props} />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.exist;
    expect($('chatbox', container)).to.not.exist;
    expect($('disclaimer', container)).to.not.exist;
    expect($('show-on-focus', container)).to.not.exist;
  });
  it('renders the sticky bot', () => {
    sandbox.stub(Chatbox, 'default').returns(<div className="chatbox" />);
    sandbox.stub(Disclaimer, 'default').returns(<div className="disclaimer" />);

    const { props, mockStore } = getData();

    const { container } = render(
      <Provider store={mockStore}>
        <Page {...props} />
      </Provider>,
    );

    expect($('va-loading-indicator', container)).to.not.exist;
    expect($('chatbox', container)).to.exist;
    expect($('disclaimer', container)).to.exist;
    expect($('show-on-focus', container)).to.not.exist;
  });
});
