import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import { RecordType } from '../../util/constants';

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
      <RecordListItem record={vitals[0]} type={RecordType.VITALS} />,
      {
        initialState: state,
        reducers: reducer,
        path: '/vitals',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Blood pressure', { exact: true })).to.exist;
  });

  it('should contain the name of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('Blood pressure', { exact: true });
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const screen = setup();
    const recordDate = screen.getByText('June 14, 2022 11:42 a.m.', {
      exact: true,
    });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = setup();
    const recordDetailsLink = screen.getByRole('link', {
      name: 'View blood pressure over time',
    });
    expect(recordDetailsLink).to.exist;
  });
});
