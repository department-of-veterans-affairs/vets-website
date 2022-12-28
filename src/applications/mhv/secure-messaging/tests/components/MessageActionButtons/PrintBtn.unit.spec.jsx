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
    const initialState = {
      message: { message: { messageResponse }, messages: null },
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
    expect(screen.getByText(/Only print this message/)).to.exist;
    expect(screen.getByText(/Print all messages in this conversation/)).to
      .exist;
  });
});
