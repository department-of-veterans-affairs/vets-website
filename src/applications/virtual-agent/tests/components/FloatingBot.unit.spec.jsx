import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import FloatingBot from '../../components/FloatingBot';
import Disclaimer from '../../components/Disclaimer';
import ChatBox from '../../components/Chatbox';

describe('FloatingBot', () => {
  it('should render the FloatingBot component', () => {
    const { container } = render(<FloatingBot />);
    expect(container).toBeInTheDocument();
  });

  it('should render the FloatingBot component', () => {
    const result = FloatingBot();
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
    const { getByTestId } = render(<FloatingBot />);
    const disclaimerElement = getByTestId('disclaimer');
    expect(disclaimerElement).toBeInTheDocument();
  });

  it('should render the ChatBox component', () => {
    const { getByTestId } = render(<FloatingBot />);
    const chatBoxElement = getByTestId('chatbox');
    expect(chatBoxElement).toBeInTheDocument();
  });
});
