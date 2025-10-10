import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent, waitFor } from '@testing-library/dom';
import { beforeEach } from 'mocha';
import reducer from '../../reducers';
import MicroDetails from '../../components/LabsAndTests/MicroDetails';
import microbiology from '../fixtures/microbiology.json';
import microbiologyWithDateMissing from '../fixtures/microbiologyWithDateMissing.json';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';

describe('Microbiology details component', () => {
  const record = convertLabsAndTestsRecord(microbiology);
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsDetails: record,
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <MicroDetails record={record} fullState={initialState} runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/124',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the test name', () => {
    const header = screen.getAllByText(record.name, {
      exact: true,
      selector: 'h1',
    });
    expect(header).to.exist;
  });

  it('should display the formatted date of completion', () => {
    const formattedDate = screen.getAllByText('August 1, 1995', {
      exact: true,
    });
    expect(formattedDate).to.exist;
  });

  it('should display the lab results', () => {
    const results = screen.getByText('Accession [UID]: PARAS 95 262 []', {
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

describe('Microbiology details component with no date', () => {
  it('should not display the formatted date if effectiveDateTime is missing', () => {
    const record = convertLabsAndTestsRecord(microbiologyWithDateMissing);
    const initialState = {
      mr: {
        labsAndTests: {
          labsAndTestsDetails: record,
        },
      },
    };

    const screen = renderWithStoreAndRouter(
      <MicroDetails record={record} fullState={initialState} runningUnitTest />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests/123',
      },
    );

    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None recorded',
      );
    });
  });
});
