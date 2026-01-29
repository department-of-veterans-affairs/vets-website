import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducers from '../../../reducers';
import PrintBtn from '../../../components/MessageActionButtons/PrintBtn';
import messageDetails from '../../fixtures/threads/message-thread-reducer.json';

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
});
