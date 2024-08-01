import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import RadiologyDetails from '../../components/LabsAndTests/RadiologyDetails';
import radiologyMhv from '../fixtures/radiologyMhv.json';
import radiologyWithMissingFields from '../fixtures/radiologyWithMissingFields.json';
import { convertMhvRadiologyRecord } from '../../reducers/labsAndTests';

describe('Radiology details component', () => {
  const radiologyRecord = convertMhvRadiologyRecord(radiologyMhv);
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
        path: '/labs-and-tests/r5621490',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getByText('DEXA, PERIPHERAL STUDY', {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it.skip('should display the formatted date', () => {
    const formattedDate = screen.getByText('January 6, 2004, 7:27 p.m.', {
      exact: true,
      selector: 'span',
    });
    expect(formattedDate).to.exist;
  });

  it('should display the reason for the test', () => {
    const reason = screen.getByText('None noted', {
      exact: true,
      selector: 'p',
    });
    expect(reason).to.exist;
  });
  it('should display the clinical history', () => {
    const reason = screen.getByText('this is 71 yr old pt', {
      exact: false,
      selector: 'p',
    });
    expect(reason).to.exist;
  });
  it('should display who the test was ordered by', () => {
    const reason = screen.getByText('DOE,JOHN', {
      exact: true,
      selector: 'p',
    });
    expect(reason).to.exist;
  });
  it('should display the performing lab location', () => {
    const reason = screen.getByText('DAYT3', {
      exact: true,
      selector: 'p',
    });
    expect(reason).to.exist;
  });
  it('should display the imaging provider', () => {
    const reason = screen.getByText('DOE,JANE', {
      exact: true,
      selector: 'p',
    });
    expect(reason).to.exist;
  });
  it('should display the images note', () => {
    const reason = screen.getByText('Images are not yet available', {
      exact: false,
      selector: 'p',
    });
    expect(reason).to.exist;
  });

  it('should display the lab results', () => {
    const results = screen.getByText('Osteopenia of the left forearm.', {
      exact: false,
      selector: 'p',
    });
    expect(results).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download txt file button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Radiology details component with missing fields', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: convertMhvRadiologyRecord(
          radiologyWithMissingFields,
        ),
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <RadiologyDetails
      record={convertMhvRadiologyRecord(radiologyWithMissingFields)}
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
