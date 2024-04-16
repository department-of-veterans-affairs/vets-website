import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import { recordType } from '../../util/constants';
import { convertVital } from '../../reducers/vitals';

describe('Vital list item component', () => {
  const initialState = {
    mr: {
      vitals: {
        vitalsList: vitals.entry.map(item => convertVital(item.resource)),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertVital(vitals.entry[0].resource)}
        type={recordType.VITALS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/vitals',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getByText('Blood pressure', { exact: true })).to.exist;
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getByText('Blood pressure', { exact: true });
    expect(recordName).to.exist;
  });

  it('should contain the result of the record', () => {
    const recordName = screen.getByText('130/70', { exact: true });
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const recordDate = screen.getByText('October', {
      exact: false,
    });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByRole('link', {
      name: 'Review blood pressure over time',
    });
    expect(recordDetailsLink).to.exist;
  });
});

// write a suite for each type of vital
