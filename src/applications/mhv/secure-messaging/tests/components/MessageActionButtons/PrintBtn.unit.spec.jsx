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
    expect(modal).to.have.attribute(
      'modaltitle',
      'Make sure you have all messages expanded',
    );
    expect(modal).to.have.attribute('visible', 'true');
    expect(document.querySelector('va-button[text="Print"]')).to.exist;
    expect(
      document.querySelector('va-button[text="Cancel"]'),
    ).to.have.attribute('secondary');
  });
});
