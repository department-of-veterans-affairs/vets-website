import sinon from 'sinon';
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { Provider } from 'react-redux';
import StickyBot from '../../components/StickyBot';
import Disclaimer from '../../components/Disclaimer';
import ChatBox from '../../components/Chatbox';
import * as DisclaimerModule from '../../components/Disclaimer';
import * as ChatBoxModule from '../../components/Chatbox';

describe('StickyBot', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render the StickyBot component', () => {
    const { container } = render(<StickyBot />);
    expect(container).toBeInTheDocument();
  });

  describe('StickyBot', () => {
    it('should render the FloatingBot component', () => {
      const result = StickyBot();

      expect(result).to.deep.equal(
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg2p5 vads-u-margin-y--4">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--5 small-desktop-screen:vads-l-col--7">
              <Disclaimer />
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--7 small-desktop-screen:vads-l-col--5">
              <ChatBox />
            </div>
          </div>
        </div>,
      );
    });

    it('should render the Disclaimer component', () => {
      sandbox
        .stub(DisclaimerModule, 'default')
        .returns(<div testid="disclaimer" />);
      sandbox.stub(ChatBoxModule, 'default').returns(<div testid="chatbox" />);

      const { getByTestId } = render(
        <Provider>
          <StickyBot />
        </Provider>,
      );

      // expect($('Disclaimer', container)).to.exist;
      expect(getByTestId('disclaimer')).to.exist;
    });

    it('should render the ChatBox component', () => {
      const { getByTestId } = render(<StickyBot />);
      const chatBoxElement = getByTestId('chatbox');
      expect(chatBoxElement).toBeInTheDocument();
    });
  });
});
