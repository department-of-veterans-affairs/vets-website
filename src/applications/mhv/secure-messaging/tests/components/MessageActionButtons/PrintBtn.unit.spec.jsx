import React from 'react';
import { fireEvent } from '@testing-library/dom';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import PrintBtn from '../../../components/MessageActionButtons/PrintBtn';
import messageResponse from '../../fixtures/message-response.json';
import reducers from '~/applications/mhv/secure-messaging/reducers';

describe('Print button', () => {
  let screen;
  beforeEach(() => {
    const id = 7155731;
    const handlePrint = () => {};
    // const initialState = {
    //   message: { message: { messageResponse }, messages: null },
    // };
    const initialState = {
      sm: {
        messageDetails: {
          message: messageResponse,
          messageHistory: null,
        },
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
    // expect(screen.getByLabelText('Only print this message')).to.exist;
    expect(screen.getByTestId('radio-print-one-message')).to.exist;

    expect(screen.getByTestId('radio-print-all-messages')).to.exist;
  });
});
