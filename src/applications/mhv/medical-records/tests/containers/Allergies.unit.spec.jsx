import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import Allergies from '../../containers/Allergies';
import reducer from '../../reducers';
import allergies from '../fixtures/allergies.json';
import user from '../fixtures/user.json';
import { convertAllergy } from '../../reducers/allergies';

describe('Allergies list container', () => {
  const initialState = {
    user,
    mr: {
      allergies: {
        allergiesList: allergies.entry.map(item =>
          convertAllergy(item.resource),
        ),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<Allergies />, {
      initialState,
      reducers: reducer,
      path: '/allergies',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Allergies and reactions', { exact: true })).to
      .exist;
  });

  it('displays the first part of the subheading', () => {
    expect(
      screen.getByText(
        'Review allergies, reactions, and side effects in your VA medical records. This includes medication side effects (also called adverse drug reactions).',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays the second part of the subheading', () => {
    expect(
      screen.getByText(
        'If you have allergies that are missing from this list, tell your care team at your next appointment.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays a count of the records', () => {
    expect(screen.getByText('Showing 1 to 5 of 5 records', { exact: false })).to
      .exist;
  });

  it('displays a list of records', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('record-list-item').length).to.eq(10);
    });
  });

  it('displays Date of birth for the print view', () => {
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });
});
