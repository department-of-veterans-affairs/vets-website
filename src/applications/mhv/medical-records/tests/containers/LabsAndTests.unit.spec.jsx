import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
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

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LabsAndTests />, {
      initialState: state,
      reducers: reducer,
      path: '/labs-and-tests',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Lab and test results', { exact: true })).to.exist;
  });

  it('displays a subheading', () => {
    const screen = setup();
    expect(
      screen.getByText(
        'Review lab and test results in your VA medical records.',
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays a count of the records', () => {
    const screen = setup();
    expect(screen.getByText('Showing 1–10 of 13 records', { exact: false })).to
      .exist;
  });

  it('displays a list of records', () => {
    const screen = setup();
    expect(screen.getAllByTestId('record-list-item').length).to.eq(10);
  });
});
