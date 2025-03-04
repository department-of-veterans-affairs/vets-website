import React from 'react';
import { render } from '@testing-library/react';
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

    const continueButton = screen.getByTestId('continue-button');

    expect(continueButton).to.have.attribute('data-dd-action-name');

    expect(continueButton.nextSibling.textContent).to.contain(
      'If you need help sooner, use one of these urgent communications options:',
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
    const continueButton = screen.queryByTestId('continue-button');
    expect(continueButton.textContent).to.contain('Continue to draft');
  });

  it('renders "Continue to reply" on type reply', () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(
      <InterstitialPage type="reply" acknowledge={acknowledgeSpy} />,
    );
    const continueButton = screen.queryByTestId('continue-button');
    expect(continueButton.textContent).to.contain('Continue to reply');
  });

  it('"Continue to start message" button responds on Enter key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(<InterstitialPage acknowledge={acknowledgeSpy} />);
    const continueButton = screen.queryByTestId('continue-button');
    userEvent.type(continueButton, '{enter}');
    expect(acknowledgeSpy.called).to.be.true;
  });

  it('"Continue to start message" button responds on Space key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(<InterstitialPage acknowledge={acknowledgeSpy} />);
    const continueButton = screen.queryByTestId('continue-button');
    userEvent.type(continueButton, '{space}');
    expect(acknowledgeSpy.called).to.be.true;
  });

  it('"Continue to start message" button does respond on Tab key', async () => {
    const acknowledgeSpy = sinon.spy();
    const screen = render(<InterstitialPage acknowledge={acknowledgeSpy} />);
    const continueButton = screen.getByTestId('continue-button');
    continueButton.focus();
    userEvent.tab();
    expect(acknowledgeSpy.called).to.be.false;
  });
});
