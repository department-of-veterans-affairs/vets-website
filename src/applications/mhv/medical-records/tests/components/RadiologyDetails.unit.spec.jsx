import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import RadiologyDetails from '../../components/LabsAndTests/RadiologyDetails';
import radiology from '../fixtures/radiology.json';
import radiologyWithMissingFields from '../fixtures/radiologyWithMissingFields.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Radiology details component', () => {
  const radiologyRecord = convertLabsAndTestsRecord(radiology);
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: radiologyRecord,
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
      <RadiologyDetails
        record={radiologyRecord}
        fullState={initialState}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/ex-MHV-imaging-0',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getAllByText(
      'RADIOLOGIC EXAMINATION, SPINE, LUMBOSACRAL; 2 OR 3 VIEWS',
      {
        exact: true,
        selector: 'h1',
      },
    );
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const formattedDate = screen.getAllByText('September', {
      exact: false,
      selector: 'p',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const results = screen.getByText('SPINE LUMBOSACRAL MIN 2 VIEWS', {
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

describe('Radiology details component with missing fields', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertLabsAndTestsRecord(
          radiologyWithMissingFields,
        ),
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <RadiologyDetails
      record={convertLabsAndTestsRecord(radiologyWithMissingFields)}
      fullState={initialState}
      runningUnitTest
    />,
    {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/123',
    },
  );

  it('should not display the date if date is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});
