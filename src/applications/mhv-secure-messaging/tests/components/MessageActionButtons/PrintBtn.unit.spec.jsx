import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/react';
import reducers from '~/applications/mhv-secure-messaging/reducers';
import PrintBtn from '../../../components/MessageActionButtons/PrintBtn';
import messageDetails from '../../fixtures/threads/message-thread-reducer.json';
import { DefaultFolders } from '../../../util/constants';

describe('Print button', () => {
  const id = 7155731;
  const initialState = {
    sm: {
      ...messageDetails,
    },
  };

  const setup = (props = {}) => {
    const defaultProps = {
      handlePrint: () => {},
      id,
      ...props,
    };

    return renderInReduxProvider(<PrintBtn {...defaultProps} />, {
      initialState,
      reducers,
    });
  };

  it('renders without errors, and displays the print button', () => {
    const screen = setup();
    expect(screen).to.exist;
  });

  it('displays print button text', () => {
    const screen = setup();
    expect(screen.getByText(/Print/)).to.exist;
  });

  it('calls handlePrint when print button is clicked', () => {
    const handlePrintSpy = sinon.spy();
    const screen = setup({ handlePrint: handlePrintSpy });
    fireEvent.click(screen.getByTestId('print-button'));
    expect(handlePrintSpy.calledOnce).to.be.true;
  });

  it('renders with correct class when activeFolder is not Sent', () => {
    const { container } = setup({
      activeFolder: { folderId: DefaultFolders.INBOX.id },
    });
    const button = container.querySelector('#print-button');
    expect(button.className).to.include('mobile-lg:vads-u-flex--3');
  });

  it('renders with correct class when activeFolder is Sent', () => {
    const { container } = setup({
      activeFolder: { folderId: DefaultFolders.SENT.id },
    });
    const button = container.querySelector('#print-button');
    expect(button.className).to.include('vads-u-flex--1');
  });

  it('renders a va-icon with print icon', () => {
    const { container } = setup();
    const icon = container.querySelector('va-icon[icon="print"]');
    expect(icon).to.exist;
  });
});
