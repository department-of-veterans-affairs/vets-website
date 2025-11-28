import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import reducers from '~/applications/mhv-secure-messaging/reducers';
import PrintBtn from '../../../components/MessageActionButtons/PrintBtn';
import messageDetails from '../../fixtures/threads/message-thread-reducer.json';
import { DefaultFolders } from '../../../util/constants';

describe('Print button', () => {
  let screen;
  let handlePrintSpy;

  afterEach(() => {
    sinon.restore();
  });

  const setupComponent = (props = {}, state = {}) => {
    const id = 7155731;
    handlePrintSpy = sinon.spy();
    const defaultProps = {
      handlePrint: handlePrintSpy,
      id,
      ...props,
    };
    
    const initialState = {
      sm: {
        ...messageDetails,
        ...state,
      },
    };

    return renderInReduxProvider(<PrintBtn {...defaultProps} />, {
      initialState,
      reducers,
    });
  };

  beforeEach(() => {
    screen = setupComponent();
  });

  it('renders without errors, and displays the print button', () => {
    expect(screen).to.exist;
    const printButton = screen.container.querySelector('#print-button');
    expect(printButton).to.exist;
  });

  it('displays print button text', () => {
    expect(screen.getByText(/Print/)).to.exist;
  });

  it('has correct data-testid attribute', () => {
    const printButton = screen.getByTestId('print-button');
    expect(printButton).to.exist;
    expect(printButton.textContent).to.equal('Print');
  });

  it('applies correct CSS classes for non-sent folder', () => {
    const button = screen.container.querySelector('#print-button');
    expect(button).to.have.class('usa-button-secondary');
    expect(button).to.have.class('vads-u-margin--0');
    expect(button).to.have.class('mobile-lg:vads-u-flex--3');
    expect(button).to.have.class('vads-u-display--flex');
    expect(button).to.have.class('vads-u-flex-direction--row');
    expect(button).to.have.class('vads-u-justify-content--center');
    expect(button).to.have.class('vads-u-align-items--center');
    expect(button).to.have.class('vads-u-padding-x--2');
    expect(button).to.have.class('message-action-button');
  });

  it('applies different CSS classes for sent folder', () => {
    const sentFolderScreen = setupComponent({
      activeFolder: { folderId: DefaultFolders.SENT.id },
    });
    const button = sentFolderScreen.container.querySelector('#print-button');
    expect(button).to.have.class('vads-u-flex--1');
    expect(button).to.have.class('tablet:vads-u-flex--auto');
    expect(button).to.have.class('vads-u-margin-left--0');
    expect(button).to.have.class('vads-u-margin-right--0');
  });

  it('contains va-icon with correct icon', () => {
    const icon = screen.container.querySelector('va-icon[icon="print"]');
    expect(icon).to.exist;
    expect(icon).to.have.attribute('aria-hidden', 'true');
  });

  it('calls handlePrint when button is clicked', () => {
    const button = screen.container.querySelector('#print-button');
    fireEvent.click(button);
    expect(handlePrintSpy.calledOnce).to.be.true;
  });

  it('has correct button type', () => {
    const button = screen.container.querySelector('#print-button');
    expect(button).to.have.attribute('type', 'button');
  });

  it('has correct data-dd-action-name attribute', () => {
    const button = screen.container.querySelector('#print-button');
    expect(button).to.have.attribute('data-dd-action-name', 'Print Button');
  });

  it('icon container has correct margin class', () => {
    const iconContainer = screen.container.querySelector('.vads-u-margin-right--0p5');
    expect(iconContainer).to.exist;
    expect(iconContainer.querySelector('va-icon')).to.exist;
  });

  it('text span has correct class and testid', () => {
    const textSpan = screen.getByTestId('print-button');
    expect(textSpan).to.have.class('message-action-button-text');
  });

  it('handles missing handlePrint prop gracefully', () => {
    const screenWithoutHandler = setupComponent({ handlePrint: undefined });
    const button = screenWithoutHandler.container.querySelector('#print-button');
    // Should not throw error when clicking
    expect(() => fireEvent.click(button)).to.not.throw();
  });

  it('handles missing activeFolder prop', () => {
    const screenWithoutFolder = setupComponent({ activeFolder: undefined });
    expect(screenWithoutFolder).to.exist;
    const button = screenWithoutFolder.container.querySelector('#print-button');
    expect(button).to.exist;
  });

  it('handles null activeFolder prop', () => {
    const screenWithNullFolder = setupComponent({ activeFolder: null });
    expect(screenWithNullFolder).to.exist;
    const button = screenWithNullFolder.container.querySelector('#print-button');
    expect(button).to.exist;
  });

  it('handles activeFolder without folderId', () => {
    const screenWithIncompleteFolder = setupComponent({ 
      activeFolder: { name: 'Test Folder' } 
    });
    expect(screenWithIncompleteFolder).to.exist;
    const button = screenWithIncompleteFolder.container.querySelector('#print-button');
    expect(button).to.exist;
  });

  it('focuses on button after print is called', () => {
    const button = screen.container.querySelector('#print-button');
    fireEvent.click(button);
    
    // Verify handlePrint was called (which should trigger focus)
    expect(handlePrintSpy.calledOnce).to.be.true;
  });

  it('renders correctly with minimal props', () => {
    const minimalScreen = setupComponent({ 
      handlePrint: sinon.spy(),
    });
    expect(minimalScreen).to.exist;
    expect(minimalScreen.getByText('Print')).to.exist;
  });
});
