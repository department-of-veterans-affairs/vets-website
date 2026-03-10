import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import DeleteDraftModal from '../../../components/Modals/DeleteDraftModal';
import { Prompts } from '../../../util/constants';

describe('Delete Draft Modal component', () => {
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
      <DeleteDraftModal visible onClose={() => {}} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('delete-draft-modal');

    expect(modal).to.exist;
    expect(modal).to.have.attribute(
      'modal-title',
      Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER,
    );
    expect(modal).to.have.attribute('status', 'warning');
    expect(screen.getByText(Prompts.Draft.DELETE_DRAFT_CONFIRM_CONTENT)).to
      .exist;
    expect(screen.getByTestId('confirm-delete-draft')).to.exist;
    expect(screen.getByTestId('cancel-delete-draft')).to.exist;
  });

  it('should render with draftSequence suffix in ids and testids', () => {
    const screen = render(
      <DeleteDraftModal
        visible
        draftSequence={3}
        onClose={() => {}}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('delete-draft-modal-3');

    expect(modal).to.exist;
    expect(modal).to.have.attribute('id', 'delete-draft-modal-3');
  });

  it('should render without draftSequence suffix when not provided', () => {
    const screen = render(
      <DeleteDraftModal visible onClose={() => {}} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('delete-draft-modal');

    expect(modal).to.have.attribute('id', 'delete-draft-modal');
  });

  it('should call onDelete when delete draft button is clicked', () => {
    const onDeleteSpy = sandbox.spy();
    const screen = render(
      <DeleteDraftModal visible onClose={() => {}} onDelete={onDeleteSpy} />,
    );
    fireEvent.click(screen.getByTestId('confirm-delete-draft'));

    expect(onDeleteSpy.calledOnce).to.be.true;
  });

  it('should call onClose when cancel button is clicked', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <DeleteDraftModal visible onClose={onCloseSpy} onDelete={() => {}} />,
    );
    fireEvent.click(screen.getByTestId('cancel-delete-draft'));

    expect(onCloseSpy.calledOnce).to.be.true;
  });

  it('should call onClose and datadogRum.addAction on close event', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <DeleteDraftModal visible onClose={onCloseSpy} onDelete={() => {}} />,
    );
    const modal = screen.getByTestId('delete-draft-modal');

    modal.__events.closeEvent();

    expect(onCloseSpy.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledOnce).to.be.true;
    expect(
      datadogRum.addAction.calledWith(
        `${Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER} Modal Closed`,
      ),
    ).to.be.true;
  });

  it('should include draftSequence in datadogRum action on close event', () => {
    const onCloseSpy = sandbox.spy();
    const screen = render(
      <DeleteDraftModal
        visible
        draftSequence={2}
        onClose={onCloseSpy}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('delete-draft-modal-2');

    modal.__events.closeEvent();

    expect(onCloseSpy.calledOnce).to.be.true;
    expect(datadogRum.addAction.calledOnce).to.be.true;
    expect(
      datadogRum.addAction.calledWith(
        `${Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER} Modal 2 Closed`,
      ),
    ).to.be.true;
  });

  it('should not be visible when visible prop is false', () => {
    const screen = render(
      <DeleteDraftModal
        visible={false}
        onClose={() => {}}
        onDelete={() => {}}
      />,
    );
    const modal = screen.getByTestId('delete-draft-modal');

    expect(modal).to.have.attribute('visible', 'false');
  });
});
