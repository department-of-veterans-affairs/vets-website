import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import Allergies from '../../containers/Allergies';
import reducer from '../../reducers';
import allergies from '../fixtures/allergies.json';
import { convertAllergy } from '../../reducers/allergies';

describe('Allergies list container', () => {
  const initialState = {
    mr: {
      allergies: {
        allergiesList: allergies.entry.map(item =>
          convertAllergy(item.resource),
        ),
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

  it('displays a subheading', () => {
    const screen = setup();
    expect(
      screen.getByText(
        'Review allergies and reactions in your VA medical records.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays a count of the records', () => {
    const screen = setup();
    expect(screen.getByText('Showing 1–5 of 5 records', { exact: false })).to
      .exist;
  });

  it('displays a list of records', () => {
    const screen = setup();
    // will be double the number of records because print view displays a duplicate of each record
    expect(screen.getAllByTestId('record-list-item').length).to.eq(10);
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
