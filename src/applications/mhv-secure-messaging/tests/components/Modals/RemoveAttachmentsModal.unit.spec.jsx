import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import RemoveAttachmentsModal from '../../../components/Modals/RemoveAttachmentModal';
import { Prompts } from '../../../util/constants';

describe('Remove Attachment Modal component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(datadogRum, 'addAction');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render without errors', () => {
    const screen = render(
      <RemoveAttachmentsModal visible onClose={() => {}} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('remove-attachment-modal');

    expect(modal).to.exist;
    expect(screen.getByText(Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT)).to
      .exist;
    expect(modal).to.have.attribute(
      'modal-title',
      Prompts.Attachment.REMOVE_ATTACHMENT_TITLE,
    );
    expect(screen.getByTestId('confirm-remove-attachment-button')).to.exist;
    expect(screen.getByTestId('cancel-remove-attachment-button')).to.exist;
    expect(modal).to.have.attribute('status', 'warning');
  });

  it('should render with draftSequence suffix in ids and testids', () => {
    const screen = render(
      <RemoveAttachmentsModal
        visible
        draftSequence={5}
        onClose={() => {}}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('remove-attachment-modal-5');

    expect(modal).to.exist;
    expect(modal).to.have.attribute('id', 'remove-attachment-modal-5');
    expect(screen.getByTestId('confirm-remove-attachment-button-5')).to.exist;
    expect(screen.getByTestId('cancel-remove-attachment-button-5')).to.exist;
  });

  it('should call onDelete when confirm button is clicked', () => {
    const onDeleteSpy = sandbox.spy();
    const screen = render(
      <RemoveAttachmentsModal
        visible
        onClose={() => {}}
        onDelete={onDeleteSpy}
      />,
    );
    fireEvent.click(screen.getByTestId('confirm-remove-attachment-button'));

    expect(onDeleteSpy.calledOnce).to.be.true;
  });

  it('should call onClose when cancel button is clicked', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <RemoveAttachmentsModal
        visible
        onClose={onCloseSpy}
        onDelete={() => {}}
      />,
    );
    fireEvent.click(screen.getByTestId('cancel-remove-attachment-button'));

    expect(onCloseSpy.calledOnce).to.be.true;
  });

  it('should call onClose and datadogRum.addAction on close event', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <RemoveAttachmentsModal
        visible
        onClose={onCloseSpy}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('remove-attachment-modal');

    modal.__events.closeEvent();

    expect(onCloseSpy.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledWith('Remove Attachment Modal Closed')).to
      .be.true;
  });

  it('should include draftSequence in datadogRum action on close event', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <RemoveAttachmentsModal
        visible
        draftSequence={2}
        onClose={onCloseSpy}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('remove-attachment-modal-2');

    modal.__events.closeEvent();

    expect(onCloseSpy.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledWith('Remove Attachment Modal Closed-2'))
      .to.be.true;
  });

  it('should not be visible when visible prop is false', () => {
    const screen = render(
      <RemoveAttachmentsModal
        visible={false}
        onClose={() => {}}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('remove-attachment-modal');

    expect(modal).to.have.attribute('visible', 'false');
  });
});
