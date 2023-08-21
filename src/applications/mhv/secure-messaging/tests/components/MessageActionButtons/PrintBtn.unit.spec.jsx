import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import PrintBtn from '../../../components/MessageActionButtons/PrintBtn';
import messageDetails from '../../fixtures/threads/message-thread-reducer.json';
import reducers from '~/applications/mhv/secure-messaging/reducers';

describe('Print button', () => {
  let screen;
  beforeEach(() => {
    const id = 7155731;
    const handlePrint = () => {};
    const initialState = {
      sm: {
        ...messageDetails,
      },
    };

    screen = renderInReduxProvider(
      <PrintBtn handlePrint={handlePrint} id={id} />,
      {
        initialState,
        reducers,
      },
    );
  });

  it('renders without errors, and displays the print button', () => {
    expect(screen);
  });
  it('displays print button text', () => {
    expect(screen.getByText(/Print/)).to.exist;
  });
  it('opens modal when print button is clicked and displays both options', () => {
    fireEvent.click(screen.getByTestId('print-button'));

    const modal = screen.getByTestId('print-modal-popup');
    expect(modal).to.exist;
    expect(modal).to.have.attribute('modaltitle', 'What do you want to print?');
    expect(modal).to.have.attribute('visible', 'true');
    expect(modal).to.have.attribute('large', 'true');
    expect(modal).to.have.attribute('primary-button-text', 'Print');
    expect(modal).to.have.attribute('secondary-button-text', 'Cancel');

    const printOneMessage = screen.getByTestId('radio-print-one-message');
    expect(printOneMessage).to.have.attribute(
      'label',
      'Print only this message',
    );

    const printAllMessages = screen.getByTestId('radio-print-all-messages');
    expect(printAllMessages).to.have.attribute(
      'label',
      'Print all messages in this conversation',
    );
    expect(printAllMessages).to.have.attribute('description', '(2 messages)');
  });
});
