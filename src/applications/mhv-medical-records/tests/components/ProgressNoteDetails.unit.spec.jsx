import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import ProgressNoteDetails from '../../components/CareSummaries/ProgressNoteDetails';
import progressNote from '../fixtures/physicianProcedureNote.json';
import noteWithFieldsMissing from '../fixtures/physicianProcedureNoteWithFieldsMissing.json';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';

describe('Adverse React/Allergy details component', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
          progressNote,
        ),
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
      <ProgressNoteDetails
        record={convertCareSummariesAndNotesRecord(progressNote)}
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
    const header = screen.getAllByText('Adverse React/Allergy', {
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

  it('should display a signer if one is present in the data', async () => {
    const signer = await screen.getByText('Signed by', {
      exact: true,
      selector: 'h3',
    });
    expect(signer).to.exist;
  });

  it('should display signed on field', () => {
    expect(
      screen.getByText('Date signed', {
        exact: true,
        selector: 'h3',
      }),
    ).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should download a txt', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Adverse React/Allergy details component with fields missing', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
          noteWithFieldsMissing,
        ),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <ProgressNoteDetails
        record={convertCareSummariesAndNotesRecord(noteWithFieldsMissing)}
        runningUnitTest
      />,
      {
        initialState,
        reducers: reducer,
        path: '/summaries-and-notes/954',
      },
    );
  });

  it('should not display the formatted date if dateSigned is missing', () => {
    expect(screen.queryByTestId('header-time').innerHTML).to.contain(
      'None noted',
    );
  });

  it('should not display a signer if one is not present in the data', () => {
    const signer = screen.queryByText('Signed by', {
      exact: true,
      selector: 'h3',
    });
    expect(signer).to.not.exist;
  });
});
