import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';

const note = {
  id: '954',
  name: 'Physician procedure note',
  type: '11505-5',
  dateSigned: 'August 5, 2022',
  dateUpdated: 'June 2, 2023',
  startDate: 'August 5, 2022',
  endDate: 'June 2, 2023',
  summary: 'summary',
  location: 'None noted',
  physician: 'AHMED,MARUF',
  admittingPhysician: 'AHMED,MARUF',
  dischargePhysician: 'AHMED,MARUF',
};

describe('CareSummariesAndNotesListItem', () => {
  const initialState = {
    mr: {
      careSummariesAndNotes: {
        careSummariesAndNotesDetails: note,
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem record={note} type="care summaries and notes" />,
      {
        initialState: state,
        reducers: reducer,
        path: '/care-summaries-and-notes',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Physician procedure note', { exact: true })).to
      .exist;
  });

  it('should contain the name of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('Physician procedure note', {
      exact: true,
    });
    expect(recordName).to.exist;
  });

  it('should contain the start date of the record', () => {
    const screen = setup();
    const recordDate = screen.getByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain the end date of the record', () => {
    const screen = setup();
    const recordDate = screen.getByText('June', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = setup();
    const recordDetailsLink = screen.getByRole('link', {
      name: 'Details',
    });
    expect(recordDetailsLink).to.exist;
  });
});
