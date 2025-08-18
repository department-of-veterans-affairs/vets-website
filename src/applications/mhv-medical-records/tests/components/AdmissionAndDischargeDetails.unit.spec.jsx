import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { fireEvent } from '@testing-library/dom';
import reducer from '../../reducers';
import AdmissionAndDischargeDetails from '../../components/CareSummaries/AdmissionAndDischargeDetails';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';
import { EMPTY_FIELD } from '../../util/constants';

describe('Admission and discharge summary details component', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
          dischargeSummary,
        ),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <AdmissionAndDischargeDetails
        record={convertCareSummariesAndNotesRecord(dischargeSummary)}
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
    const header = screen.getAllByText('Discharge Summary', {
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

  it('should display admitted on field', () => {
    expect(
      screen.getByText('Date admitted', {
        exact: false,
        selector: 'p',
      }),
    ).to.exist;
  });

  it('should display discharged on field', () => {
    expect(
      screen.getByText('Date discharged', {
        exact: true,
        selector: 'h3',
      }),
    ).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-1'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });

  it('should display a download started message when the download pdf button is clicked', () => {
    fireEvent.click(screen.getByTestId('printButton-2'));
    expect(screen.getByTestId('download-success-alert-message')).to.exist;
  });
});

describe('Admission and discharge summary details component header date', () => {
  const renderScreen = jsonRecord => {
    return renderWithStoreAndRouter(
      <AdmissionAndDischargeDetails
        record={convertCareSummariesAndNotesRecord(jsonRecord)}
      />,
      {
        initialState: {},
        reducers: reducer,
        path: '/summaries-and-notes/954',
      },
    );
  };

  it('should display admission date by default', () => {
    const jsonRecord = {
      type: { coding: [{ code: '18842-5' }] },
      context: {
        period: {
          start: '2022-05-29T13:41:23Z',
          end: '2022-06-11T13:41:23Z',
        },
      },
      date: '2022-08-08T13:41:23Z',
    };

    const screen = renderScreen(jsonRecord);
    const headerDate = screen.queryByTestId('ds-note-date-heading');
    expect(headerDate.innerHTML).to.contain('Date admitted');
    expect(headerDate.innerHTML).to.contain('May 29, 2022');
    expect(screen.queryByTestId('note-admission-date')).to.not.exist;
    expect(screen.queryByTestId('note-discharge-date')).to.exist;
  });

  it('should display discharge date second priority', () => {
    const jsonRecord = {
      type: { coding: [{ code: '18842-5' }] },
      context: {
        period: { end: '2022-06-11T13:41:23Z' },
      },
      date: '2022-08-08T13:41:23Z',
    };

    const screen = renderScreen(jsonRecord);
    const headerDate = screen.queryByTestId('ds-note-date-heading');
    expect(headerDate.innerHTML).to.contain('Date discharged');
    expect(headerDate.innerHTML).to.contain('June 11, 2022');
    expect(screen.queryByTestId('note-admission-date')).to.exist;
    expect(screen.queryByTestId('note-discharge-date')).to.not.exist;
  });

  it('should display date entered third priority', () => {
    const jsonRecord = {
      type: { coding: [{ code: '18842-5' }] },
      date: '2022-08-08T13:41:23Z',
    };

    const screen = renderScreen(jsonRecord);
    const headerDate = screen.queryByTestId('ds-note-date-heading');
    expect(headerDate.innerHTML).to.contain('Date entered');
    expect(headerDate.innerHTML).to.contain('August 8, 2022');
    expect(screen.queryByTestId('note-admission-date')).to.exist;
    expect(screen.queryByTestId('note-discharge-date')).to.exist;
  });

  it('should display "None recorded" if no date is found', () => {
    const jsonRecord = { type: { coding: [{ code: '18842-5' }] } };

    const screen = renderScreen(jsonRecord);
    const headerDate = screen.queryByTestId('ds-note-date-heading');
    expect(headerDate.innerHTML).to.contain('Date admitted');
    expect(headerDate.innerHTML).to.contain(EMPTY_FIELD);
    expect(screen.queryByTestId('note-admission-date')).to.not.exist;
    expect(screen.queryByTestId('note-discharge-date')).to.exist;
  });
});
