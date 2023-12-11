import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import sinon from 'sinon';
import InterstitialPage from '../../containers/InterstitialPage';
import { getByBrokenText } from '../../util/testUtils';

describe('Interstitial page header', () => {
  it('renders without errors', async () => {
    const screen = render(<InterstitialPage />);

    expect(
      getByBrokenText(
        'If you’re in crisis or having thoughts of suicide, ',
        document.querySelector('.interstitial-page'),
      ),
    ).to.exist;

    expect(
      screen.getByText('Continue to start message').nextSibling.textContent,
    ).to.contain(
      'If you need help sooner, use one of these urgent communication options:',
    );
    expect(
      document.querySelector(
        'va-button[text="Connect with the Veterans Crisis Line"]',
      ),
    ).to.exist;
  });

  it('renders "Continue to draft" on type draft', () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(
      <InterstitialPage type="draft" acknowledge={acknowledgeSpy} />,
    );
    fireEvent.click(screen.getByText('Continue to draft'));
    waitFor(() => {
      expect(acknowledgeSpy.calledOnce).to.be.true;
    });
  });

  it('renders "Continue to reply" on type reply', () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(
      <InterstitialPage type="reply" acknowledge={acknowledgeSpy} />,
    );
    fireEvent.click(screen.getByText('Continue to reply'));
    waitFor(() => {
      expect(acknowledgeSpy.calledOnce).to.be.true;
    });
  });

  it('"Continue to start message" button responds on Enter key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(<InterstitialPage acknowledge={acknowledgeSpy} />);
    const link = screen.container.querySelector('a');
    userEvent.type(link, '{enter}');
    expect(acknowledgeSpy.called).to.be.true;
    userEvent.type(link, '{space}');
  });

  it('"Continue to start message" button responds on Space key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(<InterstitialPage acknowledge={acknowledgeSpy} />);
    const link = screen.container.querySelector('a');
    userEvent.type(link, '{space}');
    expect(acknowledgeSpy.called).to.be.true;
  });

  it('"Continue to start message" button does respond on Tab key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(<InterstitialPage acknowledge={acknowledgeSpy} />);
    const link = screen.container.querySelector('a');
    link.focus();
    userEvent.tab();
    expect(acknowledgeSpy.called).to.be.false;
  });

  it('"Continue to start message" font size uses Large class', async () => {
    const screen = render(<InterstitialPage />);
    const continueButton = screen.getByTestId('continue-button');
    expect(continueButton).to.have.class('vads-u-font-size--lg');
  });
});
