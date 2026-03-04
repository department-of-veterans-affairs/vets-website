import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { datadogRum } from '@datadog/browser-rum';
import CreateFolderModal from '../../../components/Modals/CreateFolderModal';
import { Alerts } from '../../../util/constants';
import { inputVaTextInput } from '../../../util/testUtils';

describe('Create Folder Modal component', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(datadogRum, 'addAction');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const defaultProps = {
    isCreateNewModalVisible: true,
    setIsCreateNewModalVisible: () => {},
    onConfirm: () => {},
    folders: [],
  };

  const renderComponent = (props = {}) => {
    return render(<CreateFolderModal {...defaultProps} {...props} />);
  };

  it('should render without errors', () => {
    const screen = renderComponent();
    const modal = screen.getByTestId('create-folder-modal');

    expect(modal).to.exist;
    expect(modal).to.have.attribute(
      'modal-title',
      Alerts.Folder.CREATE_FOLDER_MODAL_HEADER,
    );
    expect(screen.getByTestId('folder-name')).to.exist;
    expect(screen.getByTestId('create-folder-button')).to.exist;
    expect(screen.getByTestId('cancel-folder-button')).to.exist;
  });

  it('should show blank name error when submitting empty folder name', () => {
    const screen = renderComponent();
    fireEvent.click(screen.getByTestId('create-folder-button'));

    const input = screen.getByTestId('folder-name');
    expect(input).to.have.attribute(
      'error',
      Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
    );
  });

  it('should show blank name error when folder name is only whitespace', () => {
    const screen = renderComponent();

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      '   ',
      'va-text-input',
    );

    fireEvent.click(screen.getByTestId('create-folder-button'));

    const input = screen.getByTestId('folder-name');
    expect(input).to.have.attribute(
      'error',
      Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
    );
  });

  it('should show duplicate name error when folder name already exists', () => {
    const folders = [{ name: 'Existing Folder' }];
    const screen = renderComponent({ folders });

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      'Existing Folder',
      'va-text-input',
    );

    fireEvent.click(screen.getByTestId('create-folder-button'));

    const input = screen.getByTestId('folder-name');
    expect(input).to.have.attribute(
      'error',
      Alerts.Folder.CREATE_FOLDER_ERROR_EXSISTING_NAME,
    );
  });

  it('should show special character error when folder name has special chars', () => {
    const screen = renderComponent();

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      'Test@Folder!',
      'va-text-input',
    );

    fireEvent.click(screen.getByTestId('create-folder-button'));

    const input = screen.getByTestId('folder-name');
    expect(input).to.have.attribute(
      'error',
      Alerts.Folder.CREATE_FOLDER_ERROR_CHAR_TYPE,
    );
  });

  it('should call onConfirm with folder name when valid name is submitted', () => {
    const onConfirmSpy = sandbox.spy();
    const screen = renderComponent({ onConfirm: onConfirmSpy });

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      'New Folder',
      'va-text-input',
    );

    fireEvent.click(screen.getByTestId('create-folder-button'));

    expect(onConfirmSpy.calledOnce).to.be.true;
    expect(onConfirmSpy.firstCall.args[0]).to.equal('New Folder');
    expect(onConfirmSpy.firstCall.args[1]).to.be.a('function');
  });

  it('should reset state and close modal when cancel is clicked', () => {
    const setIsCreateNewModalVisibleSpy = sandbox.spy();
    const screen = renderComponent({
      setIsCreateNewModalVisible: setIsCreateNewModalVisibleSpy,
    });

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      'Some Folder',
      'va-text-input',
    );

    fireEvent.click(screen.getByTestId('cancel-folder-button'));

    expect(setIsCreateNewModalVisibleSpy.calledWith(false)).to.be.true;
  });

  it('should reset state and close modal and track with datadog on close event', () => {
    const setIsCreateNewModalVisibleSpy = sandbox.spy();
    const screen = renderComponent({
      setIsCreateNewModalVisible: setIsCreateNewModalVisibleSpy,
    });

    const modal = screen.getByTestId('create-folder-modal');
    modal.__events.closeEvent();

    expect(setIsCreateNewModalVisibleSpy.calledWith(false)).to.be.true;
    expect(datadogRum.addAction.calledOnce).to.be.true;
    expect(
      datadogRum.addAction.calledWith('Create New Folder Modal Closed'),
    ).to.be.true;
  });

  it('should not be visible when isCreateNewModalVisible is false', () => {
    const screen = renderComponent({ isCreateNewModalVisible: false });
    const modal = screen.getByTestId('create-folder-modal');

    expect(modal).to.have.attribute('visible', 'false');
  });

  it('should clear error when user types in the input after error', () => {
    const screen = renderComponent();

    fireEvent.click(screen.getByTestId('create-folder-button'));

    const input = screen.getByTestId('folder-name');
    expect(input).to.have.attribute(
      'error',
      Alerts.Folder.CREATE_FOLDER_ERROR_NOT_BLANK,
    );

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      'Valid Name',
      'va-text-input',
    );

    expect(screen.getByTestId('folder-name')).to.have.attribute('error', '');
  });

  it('should show blank error on input when user clears the folder name', () => {
    const screen = renderComponent();

    inputVaTextInput(
      screen.getByTestId('create-folder-modal'),
      '',
      'va-text-input',
    );

    expect(screen.getByTestId('folder-name')).to.have.attribute(
      'error',
      'Folder name cannot be blank',
    );
  });
});
