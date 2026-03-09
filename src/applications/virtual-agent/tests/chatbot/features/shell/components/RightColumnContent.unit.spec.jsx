import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';

import * as ReactReduxModule from 'react-redux';

import RightColumnContent from '../../../../../chatbot/features/shell/components/RightColumnContent';

describe('RightColumnContent', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(ReactReduxModule, 'useDispatch').returns(sinon.stub());
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the disclaimer and calls onAccept when not accepted', () => {
    const onAccept = sandbox.stub();
    sandbox.stub(ReactReduxModule, 'useSelector').callsFake(selector =>
      selector({
        chatbot: {
          hasAcceptedDisclaimer: false,
          connectionStatus: 'connected',
          messages: [],
          errorMessage: null,
        },
      }),
    );

    const { getByTestId } = render(<RightColumnContent onAccept={onAccept} />);

    expect(getByTestId('chatbox-container')).to.exist;
    expect(getByTestId('disclaimer')).to.exist;

    fireEvent.click(getByTestId('btnAcceptDisclaimer'));
    expect(onAccept.calledOnce).to.be.true;
  });

  it('renders the message list when accepted', () => {
    sandbox.stub(ReactReduxModule, 'useSelector').callsFake(selector =>
      selector({
        chatbot: {
          hasAcceptedDisclaimer: true,
          connectionStatus: 'connected',
          messages: [],
          errorMessage: null,
        },
      }),
    );

    const { getByTestId, queryByTestId } = render(<RightColumnContent />);

    expect(getByTestId('chat-message-list')).to.exist;
    expect(queryByTestId('disclaimer')).to.equal(null);
  });

  it('shows delete button and calls clearConversation in chat mode', () => {
    const clearConversation = sandbox.stub();
    sandbox.stub(ReactReduxModule, 'useSelector').callsFake(selector =>
      selector({
        chatbot: {
          hasAcceptedDisclaimer: true,
          connectionStatus: 'connected',
          messages: [],
          errorMessage: null,
        },
      }),
    );

    const { getByTestId } = render(
      <RightColumnContent clearConversation={clearConversation} />,
    );

    fireEvent.click(getByTestId('chat-delete-button'));
    expect(clearConversation.calledOnce).to.be.true;
  });

  it('renders a loading state until connected', () => {
    sandbox.stub(ReactReduxModule, 'useSelector').callsFake(selector =>
      selector({
        chatbot: {
          hasAcceptedDisclaimer: true,
          connectionStatus: 'connecting',
          messages: [],
          errorMessage: null,
        },
      }),
    );

    const { getByTestId, queryByTestId } = render(<RightColumnContent />);

    expect(getByTestId('chatbot-loading-state')).to.exist;
    expect(queryByTestId('disclaimer')).to.equal(null);
  });
});
