import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';

describe('Vital list item component', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: vitals,
        vitalDetails: vitals[0],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem record={vitals[0]} type="vital" />,
      {
        initialState: state,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Blood pressure', { exact: true })).to.exist;
  });

  it('should contain the name and date of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('Blood pressure', { exact: true });
    const recordDate = screen.getByText('June', { exact: false });
    expect(recordName).to.exist;
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = setup();
    const recordDetailsLink = screen.getByRole('link', {
      name: 'View Blood pressure over time',
    });
    expect(recordDetailsLink).to.exist;
  });
});
