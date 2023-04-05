import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Vaccines from '../../containers/Vaccines';
import reducer from '../../reducers';

describe('Vaccines list container', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccinesList: null,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Vaccines />, {
      initialState: state,
      reducers: reducer,
      path: '/vaccines',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Vaccines', { exact: true })).to.exist;
  });

  it('displays CONFIDENTIAL header for print view', () => {
    const screen = setup();
    const printHeading = screen.getByRole('heading', {
      name: 'CONFIDENTIAL',
      level: 4,
    });
    expect(printHeading).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });
});
