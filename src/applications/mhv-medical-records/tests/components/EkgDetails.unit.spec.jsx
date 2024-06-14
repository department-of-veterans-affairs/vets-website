import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import EkgDetails from '../../components/LabsAndTests/EkgDetails';
import ekg from '../fixtures/ekg.json';
import ekgWithMissingFields from '../fixtures/ekgWithMissingFields.json';

describe('EKG details component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: ekg,
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
      <EkgDetails record={ekg} runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/123',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getAllByText(ekg.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date', () => {
    const dateElement = screen.getByText('April 13, 2022, 5:25 a.m. MDT', {
      exact: true,
      selector: 'span',
    });
    expect(dateElement).to.exist;
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

describe('EKG details component with missing fields', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: ekgWithMissingFields,
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <EkgDetails
      record={ekgWithMissingFields}
      fullState={initialState}
      runningUnitTest
    />,
    {
      initialState,
      reducers: reducer,
      path: '/labs-and-tests/123',
    },
  );

  it('should not display the formatted date if date is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});
