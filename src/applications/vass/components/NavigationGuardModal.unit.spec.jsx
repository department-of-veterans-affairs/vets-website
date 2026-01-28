import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import sinon from 'sinon';
import NavigationGuardModal from './NavigationGuardModal';

describe('NavigationGuardModal', () => {
  it('should render modal when visible is true', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { getByTestId } = render(
      <NavigationGuardModal visible onClose={onClose} onConfirm={onConfirm} />,
    );

    const modal = getByTestId('navigation-guard-modal');
    expect(modal).to.exist;
  });

  it('should not be visible when visible prop is false', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { container } = render(
      <NavigationGuardModal
        visible={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('visible')).to.equal('false');
  });

  it('should display custom title and message', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();
    const customTitle = 'Custom Warning Title';
    const customMessage = 'This is a custom warning message';

    const { container } = render(
      <NavigationGuardModal
        visible
        onClose={onClose}
        onConfirm={onConfirm}
        title={customTitle}
        message={customMessage}
      />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('modal-title')).to.equal(customTitle);
    expect(container.textContent).to.include(customMessage);
  });

  it('should use default title and message when not provided', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { container } = render(
      <NavigationGuardModal visible onClose={onClose} onConfirm={onConfirm} />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('modal-title')).to.equal('Leave this page?');
    expect(container.textContent).to.include(
      'If you leave this page now, your progress will not be saved.',
    );
  });

  it('should display custom button text', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();
    const customConfirmText = 'Yes, leave';
    const customCancelText = 'No, stay';

    const { container } = render(
      <NavigationGuardModal
        visible
        onClose={onClose}
        onConfirm={onConfirm}
        confirmText={customConfirmText}
        cancelText={customCancelText}
      />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('primary-button-text')).to.equal(
      customCancelText,
    );
    expect(modal.getAttribute('secondary-button-text')).to.equal(
      customConfirmText,
    );
  });

  it('should have warning status', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { container } = render(
      <NavigationGuardModal visible onClose={onClose} onConfirm={onConfirm} />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('status')).to.equal('warning');
  });

  it('should call onClose when close event is triggered', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { container } = render(
      <NavigationGuardModal visible onClose={onClose} onConfirm={onConfirm} />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;

    // Trigger close event
    modal.__events.closeEvent();

    expect(onClose.calledOnce).to.be.true;
  });

  it('should call onClose when primary button is clicked', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { container } = render(
      <NavigationGuardModal visible onClose={onClose} onConfirm={onConfirm} />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;

    // Trigger primary button click (Stay on page)
    modal.__events.primaryButtonClick();

    expect(onClose.calledOnce).to.be.true;
    expect(onConfirm.called).to.be.false;
  });

  it('should call onConfirm when secondary button is clicked', () => {
    const onClose = sinon.spy();
    const onConfirm = sinon.spy();

    const { container } = render(
      <NavigationGuardModal visible onClose={onClose} onConfirm={onConfirm} />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;

    // Trigger secondary button click (Leave page)
    modal.__events.secondaryButtonClick();

    expect(onConfirm.calledOnce).to.be.true;
    expect(onClose.called).to.be.false;
  });
});
