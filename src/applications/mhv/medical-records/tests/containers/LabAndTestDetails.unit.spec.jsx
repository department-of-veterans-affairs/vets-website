import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../reducers';
import labsAndTests from '../fixtures/labsAndTests.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import LabAndTestDetails from '../../containers/LabAndTestDetails';

describe('LabsAndTests list container', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[0]),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(<LabAndTestDetails />, {
      initialState: state,
      reducers: reducer,
      path: '/labs-and-tests/ex-MHV-chReport-1',
    });
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays date of birth for the print view', () => {
    const screen = setup();
    expect(screen.getByText('Date of birth:', { exact: false })).to.exist;
  });

  it('displays a print button', () => {
    const screen = setup();
    const printButton = screen.getByTestId('print-records-button');
    expect(printButton).to.exist;
  });

  it('displays the allergy name as an h1', () => {
    const screen = setup();

    const allergyName = screen.getByText(
      'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(allergyName).to.exist;
  });

  it('displays the type of test', () => {
    const screen = setup();
    expect(
      screen.getByText(
        'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
        { exact: true, selector: 'p' },
      ),
    ).to.exist;
  });

  it('displays the sample tested, ordered by, ordering location, and collection location', () => {
    const screen = setup();
    expect(
      screen.getAllByText('None noted', {
        exact: true,
        selector: 'p',
      }).length,
    ).to.eq(6);
  });

  it('displays provider notes', () => {
    const screen = setup();
    expect(
      screen.getByText(
        "Lisa's Test 1/20/2021 - Second lab Added Potassium test",
        { exact: false },
      ),
    ).to.exist;
  });

  it('displays results label', () => {
    const screen = setup();
    expect(screen.getByText('Results', { exact: true, selector: 'h2' })).to
      .exist;
  });

  it('displays a list of results', () => {
    const screen = setup();
    expect(screen.getAllByRole('listitem')).to.exist;
  });
});
