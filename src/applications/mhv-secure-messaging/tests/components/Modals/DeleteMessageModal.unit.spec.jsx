import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import DeleteMessageModal from '../../../components/Modals/DeleteMessageModal';
import { Prompts } from '../../../util/constants';

describe('Delete Message Modal component', () => {
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
      <DeleteMessageModal visible onClose={() => {}} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('delete-message-modal');

    expect(modal).to.exist;
    expect(modal).to.have.attribute(
      'modal-title',
      Prompts.Message.DELETE_MESSAGE_CONFIRM,
    );
    expect(modal).to.have.attribute('status', 'warning');
    expect(screen.getByTestId('delete-message-confirm-note')).to.exist;
    expect(screen.getByText(Prompts.Message.DELETE_MESSAGE_CONFIRM_NOTE)).to
      .exist;
  });

  it('should call onClose and datadogRum.addAction on close event', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <DeleteMessageModal visible onClose={onCloseSpy} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('delete-message-modal');

    modal.__events.closeEvent();

    expect(onCloseSpy.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledWith('Delete Message Modal Closed')).to.be
      .true;
  });

  it('should call onDelete on primary button click', () => {
    const onDeleteSpy = sandbox.spy();
    const screen = render(
      <DeleteMessageModal visible onClose={() => {}} onDelete={onDeleteSpy} />,
    );
    const modal = screen.getByTestId('delete-message-modal');

    modal.__events.primaryButtonClick();

    expect(onDeleteSpy.calledOnce).to.be.true;
  });

  it('should call onClose on secondary button click', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <DeleteMessageModal visible onClose={onCloseSpy} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('delete-message-modal');

    modal.__events.secondaryButtonClick();

    expect(onCloseSpy.calledOnce).to.be.true;
  });

  it('should not be visible when visible prop is false', () => {
    const screen = render(
      <DeleteMessageModal
        visible={false}
        onClose={() => {}}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('delete-message-modal');

    expect(modal).to.have.attribute('visible', 'false');
  });
});
