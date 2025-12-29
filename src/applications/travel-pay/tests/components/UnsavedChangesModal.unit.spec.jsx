import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import UnsavedChangesModal from '../../components/UnsavedChangesModal';

describe('UnsavedChangesModal', () => {
  const defaultProps = {
    visible: true,
    onCloseEvent: sinon.spy(),
    onPrimaryButtonClick: sinon.spy(),
    onSecondaryButtonClick: sinon.spy(),
  };

  it('renders the modal with correct title and content', () => {
    const { container } = render(<UnsavedChangesModal {...defaultProps} />);

    const modal = container.querySelector('va-modal');
    expect(modal).to.exist;
    expect(modal.getAttribute('modal-title')).to.equal('Leave page?');
    expect(modal.getAttribute('status')).to.equal('warning');
  });

  it('displays the correct warning message', () => {
    const { getByText } = render(<UnsavedChangesModal {...defaultProps} />);

    expect(
      getByText(
        'If you leave, you’ll lose any changes you made to this expense.',
      ),
    ).to.exist;
  });

  it('has correct button text', () => {
    const { container } = render(<UnsavedChangesModal {...defaultProps} />);

    const modal = container.querySelector('va-modal');
    expect(modal.getAttribute('primary-button-text')).to.equal('Cancel');
    expect(modal.getAttribute('secondary-button-text')).to.equal('Leave page');
  });

  it('calls onPrimaryButtonClick when primary button is clicked', () => {
    const onPrimary = sinon.spy();
    const { container } = render(
      <UnsavedChangesModal
        {...defaultProps}
        onPrimaryButtonClick={onPrimary}
      />,
    );

    const modal = container.querySelector('va-modal');
    const event = new CustomEvent('primaryButtonClick');
    modal.dispatchEvent(event);

    expect(onPrimary.calledOnce).to.be.true;
  });

  it('calls onSecondaryButtonClick when secondary button is clicked', () => {
    const onSecondary = sinon.spy();
    const { container } = render(
      <UnsavedChangesModal
        {...defaultProps}
        onSecondaryButtonClick={onSecondary}
      />,
    );

    const modal = container.querySelector('va-modal');
    const event = new CustomEvent('secondaryButtonClick');
    modal.dispatchEvent(event);

    expect(onSecondary.calledOnce).to.be.true;
  });

  it('calls onCloseEvent when modal is closed', () => {
    const onClose = sinon.spy();
    const { container } = render(
      <UnsavedChangesModal {...defaultProps} onCloseEvent={onClose} />,
    );

    const modal = container.querySelector('va-modal');
    const event = new CustomEvent('closeEvent');
    modal.dispatchEvent(event);

    expect(onClose.calledOnce).to.be.true;
  });

  it('does not render when visible is false', () => {
    const { container } = render(
      <UnsavedChangesModal {...defaultProps} visible={false} />,
    );

    const modal = container.querySelector('va-modal');
    expect(modal.getAttribute('visible')).to.equal('false');
  });
});
