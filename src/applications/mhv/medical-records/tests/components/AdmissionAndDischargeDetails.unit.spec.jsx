import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent, waitFor } from '@testing-library/dom';
import reducer from '../../reducers';
import AdmissionAndDischargeDetails from '../../components/CareSummaries/AdmissionAndDischargeDetails';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import dischargeSummaryWithDateMissing from '../fixtures/dischargeSummaryWithDateMissing.json';
import { convertNote } from '../../reducers/careSummariesAndNotes';

describe('Admission and discharge summary details component', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertNote(dischargeSummary),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <AdmissionAndDischargeDetails
        record={convertNote(dischargeSummary)}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/summaries-and-notes/954',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen).to.exist;
  });

  it('should display the summary name', () => {
    const header = screen.getAllByText('Discharge summary', {
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

  it('should download a pdf', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen).to.exist;
  });
});

describe('Admission and discharge summary details component with no dates', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertNote(
          dischargeSummaryWithDateMissing,
        ),
      },
    },
  };

  const screen = renderWithStoreAndRouter(
    <AdmissionAndDischargeDetails
      record={convertNote(dischargeSummaryWithDateMissing)}
    />,
    {
      initialState,
      reducers: reducer,
      path: '/summaries-and-notes/954',
    },
  );

  it('should not display the formatted date if startDate or endDate is missing', () => {
    waitFor(() => {
      expect(screen.queryByTestId('header-time').innerHTML).to.contain(
        'None noted',
      );
    });
  });
});
