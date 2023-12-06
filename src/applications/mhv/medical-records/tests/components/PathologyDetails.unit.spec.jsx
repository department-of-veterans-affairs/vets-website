import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import PathologyDetails from '../../components/LabsAndTests/PathologyDetails';
import pathology from '../fixtures/pathology.json';
import pathologyWithDateMissing from '../fixtures/pathologyWithDateMissing.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Pathology details component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(pathology),
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
      <PathologyDetails
        record={convertLabsAndTestsRecord(pathology)}
        fullState={initialState}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/125',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getAllByText('LR SURGICAL PATHOLOGY REPORT', {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const formattedDate = screen.getAllByText('August', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const results = screen.getByText('Pathologist:SEETHA SURYAPRASAD', {
      exact: false,
      selector: 'p',
    });
    expect(results).to.exist;
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

describe('Pathology details component with no date', () => {
  it('should not display the formatted date if effectiveDateTime is missing', () => {
    const record = convertLabsAndTestsRecord(pathologyWithDateMissing);
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: record,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <PathologyDetails
        record={record}
        fullState={initialState}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/123',
      },
    );

    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});
