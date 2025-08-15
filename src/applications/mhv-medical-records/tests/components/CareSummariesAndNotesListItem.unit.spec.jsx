import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import RecordListItem from '../../components/RecordList/RecordListItem';
import CareSummariesAndNotesListItem from '../../components/RecordList/CareSummariesAndNotesListItem';
import reducer from '../../reducers';
import physicianProcedureNote from '../fixtures/physicianProcedureNote.json';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';
import { EMPTY_FIELD } from '../../util/constants';

describe('CareSummariesAndNotesListItem with clinical note', () => {
  const record = convertCareSummariesAndNotesRecord(physicianProcedureNote);
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: record,
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem record={record} type="care summaries and notes" />,
      {
        initialState,
        reducers: reducer,
        path: '/summaries-and-notes/123',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getAllByText('Adverse React/Allergy').length).to.eq(2);
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getAllByText('Adverse React/Allergy');
    expect(recordName.length).to.eq(2);
  });

  it('should contain the date of the record', () => {
    const recordDate = screen.getAllByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByRole('link', {
      name: /Adverse React\/Allergy on August 5/,
    });
    expect(recordDetailsLink).to.exist;
  });
});

describe('CareSummariesAndNotesListItem with discharge summary', () => {
  const record = convertCareSummariesAndNotesRecord(dischargeSummary);
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: record,
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem record={record} type="care summaries and notes" />,
      {
        initialState,
        reducers: reducer,
        path: '/summaries-and-notes/123',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getAllByText('Discharge Summary').length).to.eq(2);
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getAllByText('Discharge Summary');
    expect(recordName.length).to.eq(2);
  });

  it('should contain the date of the record', () => {
    const recordDate = screen.getAllByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByRole('link', {
      name: /Discharge Summary on August/,
    });
    expect(recordDetailsLink).to.exist;
  });
});

describe('CareSummariesAndNotesListItem DS date field', () => {
  const renderScreen = jsonRecord => {
    return renderWithStoreAndRouter(
      <CareSummariesAndNotesListItem
        record={convertCareSummariesAndNotesRecord(jsonRecord)}
      />,
      {},
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
    const headerDate = screen.queryByTestId('note-item-date');
    expect(headerDate.innerHTML).to.contain('Date admitted');
    expect(headerDate.innerHTML).to.contain('May 29, 2022');
    const srDate = screen.queryByTestId('sr-note-date');
    expect(srDate.innerHTML).to.contain('May 29, 2022');
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
    const headerDate = screen.queryByTestId('note-item-date');
    expect(headerDate.innerHTML).to.contain('Date discharged');
    expect(headerDate.innerHTML).to.contain('June 11, 2022');
    const srDate = screen.queryByTestId('sr-note-date');
    expect(srDate.innerHTML).to.contain('June 11, 2022');
  });

  it('should display date entered third priority', () => {
    const jsonRecord = {
      type: { coding: [{ code: '18842-5' }] },
      date: '2022-08-08T13:41:23Z',
    };

    const screen = renderScreen(jsonRecord);
    const headerDate = screen.queryByTestId('note-item-date');
    expect(headerDate.innerHTML).to.contain('Date entered');
    expect(headerDate.innerHTML).to.contain('August 8, 2022');
    const srDate = screen.queryByTestId('sr-note-date');
    expect(srDate.innerHTML).to.contain('August 8, 2022');
  });

  it('should display "None recorded" if no date is found', () => {
    const jsonRecord = { type: { coding: [{ code: '18842-5' }] } };

    const screen = renderScreen(jsonRecord);
    const headerDate = screen.queryByTestId('note-item-date');
    expect(headerDate.innerHTML).to.contain('Date admitted');
    expect(headerDate.innerHTML).to.contain(EMPTY_FIELD);
    const srDate = screen.queryByTestId('sr-note-date');
    expect(srDate.innerHTML).to.contain(EMPTY_FIELD);
  });
});
