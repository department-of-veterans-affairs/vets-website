import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { beforeEach } from 'mocha';
import LabsAndTests from '../../containers/LabsAndTests';
import reducer from '../../reducers';
import labsAndTests from '../fixtures/labsAndTests.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('LabsAndTests list container', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests.entry.map(item =>
          convertLabsAndTestsRecord(item),
        ),
      },
    },
  };

  let screen = null;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(<LabsAndTests />, {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests',
    });
  });

  it('renders without errors', () => {
    expect(screen.getByText('Lab and test results', { exact: true })).to.exist;
  });

  it('displays a subheading', () => {
    expect(
      screen.getByText(
        'Review lab and test results in your VA medical records.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays a count of the records', () => {
    expect(screen.getByText('Showing 1–10 of 13 records', { exact: false })).to
      .exist;
  });

  it('displays a list of records', async () => {
    await waitFor(() => {
      expect(screen.getAllByTestId('record-list-item').length).to.eq(10);
    });
  });
});
