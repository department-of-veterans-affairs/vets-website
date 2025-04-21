import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import PathologyDetails from '../../components/LabsAndTests/PathologyDetails';
import pathology from '../fixtures/pathology.json';
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
    // matches any one of the four expected strings
    const pathologyLabelRe = /^LR SURGICAL (PATHOLOGY|SURGICAL_PATHOLOGY|ELECTRON_MICROSCOPY|CYTOPATHOLOGY) REPORT$/;

    const headers = screen.getAllByText(pathologyLabelRe, {
      exact: true,
      selector: 'h1',
    });

    // ensure at least one matching header was found
    expect(headers.length).to.be.greaterThan(0);
  });

  it('should display the formatted date', () => {
    const formattedDate = screen.getAllByText('august', {
      exact: false,
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const results = screen.getByText('Brief Clinical History:', {
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
