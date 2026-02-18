import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { fireEvent, render } from '@testing-library/react';

import TravelPayButtonPair from '../../components/shared/TravelPayButtonPair';

describe('TravelPayButtonPair', () => {
  const defaultProps = {
    onBack: sinon.spy(),
    onContinue: sinon.spy(),
    backText: 'Back',
    continueText: 'Continue',
  };

  const setup = (props = {}) =>
    render(<TravelPayButtonPair {...defaultProps} {...props} />);

  it('renders both buttons with correct text', () => {
    const { container } = setup();

    const backButton = container.querySelector('va-button[text="Back"]');
    expect(backButton).to.exist;
    expect(backButton.getAttribute('back')).to.equal('true');

    const continueButton = container.querySelector(
      'va-button[text="Continue"]',
    );
    expect(continueButton).to.exist;
    expect(continueButton.getAttribute('continue')).to.equal('true');
  });

  it('calls onBack when back button is clicked', () => {
    const onBack = sinon.spy();
    const { container } = setup({ onBack });

    const backButton = container.querySelector('va-button[text="Back"]');

    fireEvent.click(backButton);

    expect(onBack.calledOnce).to.be.true;
  });

  it('calls onContinue when continue button is clicked', () => {
    const onContinue = sinon.spy();
    const { container } = setup({ onContinue });

    const continueButton = container.querySelector(
      'va-button[text="Continue"]',
    );

    fireEvent.click(continueButton);

    expect(onContinue.calledOnce).to.be.true;
  });

  it('applies the disabled attribute to both buttons', () => {
    const { container } = setup({ disabled: true });

    const buttons = container.querySelectorAll('va-button');
    expect(buttons.length).to.equal(2);

    buttons.forEach(btn => {
      expect(btn.disabled).to.be.true;
    });
  });

  it('applies loading state to continue button only', () => {
    const { container } = setup({ loading: true });

    const buttons = container.querySelectorAll('va-button');
    const continueBtn = buttons[1];

    expect(continueBtn.loading).to.be.true;
    expect(buttons[0].loading).to.not.be.true;
  });

  it('applies the custom className to the wrapper <ul>', () => {
    const { container } = setup({ className: 'my-custom-class' });

    const ul = container.querySelector('ul.travel-pay-button-group');
    expect(ul.classList.contains('my-custom-class')).to.be.true;
  });

  it('sets the "back" attribute on the back button only when text is "Back"', () => {
    const { container } = setup({ backText: 'Back' });

    const backButton = container.querySelectorAll('va-button')[0];
    expect(backButton.getAttribute('back')).to.equal('true');
  });

  it('does NOT set the "back" attribute when backText is not "Back"', () => {
    const { container } = setup({ backText: 'Go back' });

    // Get all va-buttons and find the one with text="Go back"
    const backButton = Array.from(container.querySelectorAll('va-button')).find(
      btn => btn.getAttribute('text') === 'Go back',
    );

    expect(backButton).to.exist;
    expect(backButton.getAttribute('back')).to.equal('false');
  });

  it('sets the "continue" attribute when hideContinueButtonArrows is false', () => {
    const { container } = setup({ hideContinueButtonArrows: false });

    const continueButton = container.querySelectorAll('va-button')[1];
    expect(continueButton.getAttribute('continue')).to.equal('true');
  });

  it('does NOT set the "continue" attribute when hideContinueButtonArrows is true', () => {
    const { container } = setup({ hideContinueButtonArrows: true });

    // Get all va-buttons and find the one with text="Continue"
    const continueButton = Array.from(
      container.querySelectorAll('va-button'),
    ).find(btn => btn.getAttribute('text') === 'Continue');
    expect(continueButton.getAttribute('continue')).to.equal('false');
  });
});
