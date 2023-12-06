import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import ChemHemDetails from '../../components/LabsAndTests/ChemHemDetails';
import chemHem from '../fixtures/chemHem.json';
import chemHemWithDateMissing from '../fixtures/chemHemWithDateMissing.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Chem Hem details component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(chemHem),
      },
    },
    featureToggles: {
      // eslint-disable-next-line camelcase
      mhv_medical_records_allow_txt_downloads: true,
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <ChemHemDetails
        record={convertLabsAndTestsRecord(chemHem)}
        fullState={initialState}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/ex-MHV-chReport-1',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getAllByText(
      'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(header).to.exist;
  });

  it('should display the test results', () => {
    const results = screen.getByText('POTASSIUM', {
      exact: true,
      selector: 'h3',
    });
    expect(results).to.exist;
  });

  it('should display the formatted date', () => {
    const dateElement = screen.getByText('January', {
      exact: false,
      selector: 'span',
    });
    expect(dateElement).to.exist;
  });

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });

  it('should download a text file', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen).to.exist;
  });
});

describe('Chem hem details component with no date', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(chemHemWithDateMissing),
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <ChemHemDetails
      record={convertLabsAndTestsRecord(chemHemWithDateMissing)}
      fullState={initialState}
      runningUnitTest
    />,
    {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/123',
    },
  );

  it('should not display the formatted date if effectiveDateTime is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});
