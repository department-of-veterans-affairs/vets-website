import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Allergies from '../../containers/Allergies';
import reducer from '../../reducers';

describe('Vaccines list container', () => {
  const initialState = {
    mr: {
      allergies: {
        allergiesList: null,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<Allergies />, {
      initialState: state,
      reducers: reducer,
      path: '/allergies',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Allergies', { exact: true })).to.exist;
  });

  it('displays Date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });
});
