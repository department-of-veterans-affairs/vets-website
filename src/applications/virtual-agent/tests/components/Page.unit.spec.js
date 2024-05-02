import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import useChosenBot from '../../hooks/useChosenBot';
import Page from '../../components/Page';

const getData = ({
  virtualAgentShowFloatingChatbot,
  chosenBot,
  isLoading,
}) => ({
  props: {
    virtualAgentShowFloatingChatbot,
  },
  mockStore: {
    getState: () => ({
      chosenBot,
      isLoading,
    }),
    subscribe: () => {},
    dispatch: () => {},
  },
});

describe('Page', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.reset();
  });

  it('should render', () => {
    const { props, mockStore } = getData({
      virtualAgentShowFloatingChatbot: true,
      chosenBot: 'floating',
      isLoading: false,
    });

    sandbox.stub(useChosenBot, 'default');

    render(
      <Provider store={mockStore}>
        <Page {...props} />
      </Provider>,
    );

    expect(document.getElementById('chatbot-icon').classList.contains('hide'))
      .to.be.true;
    expect(document.getElementById('chatbot-icon').classList.contains('hide'))
      .to.be.true;
  });
});
