import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import physicianProcedureNote from '../fixtures/physicianProcedureNote.json';
import dischargeSummary from '../fixtures/dischargeSummary.json';
import { convertCareSummariesAndNotesRecord } from '../../reducers/careSummariesAndNotes';

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
    expect(screen.getByText('Progress note', { exact: true })).to.exist;
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getByText('Progress note', {
      exact: true,
    });
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const recordDate = screen.getAllByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByRole('link', {
      name: /Details/,
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
    expect(screen.getByText('Discharge summary', { exact: true })).to.exist;
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getByText('Discharge summary', {
      exact: true,
    });
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const recordDate = screen.getAllByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByRole('link', {
      name: /Details/,
    });
    expect(recordDetailsLink).to.exist;
  });
});
