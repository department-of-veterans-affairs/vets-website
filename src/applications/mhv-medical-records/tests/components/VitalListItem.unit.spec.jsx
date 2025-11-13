import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import RecordListItem from '../../components/RecordList/RecordListItem';
import VitalListItem from '../../components/RecordList/VitalListItem';
import reducer from '../../reducers';
import vitals from '../fixtures/vitals.json';
import { recordType, vitalTypes } from '../../util/constants';
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
    const recordDate = screen.getByText('October 27, 2023', {
      exact: true,
    });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByRole('link', {
      name: 'Review your blood pressure over time',
    });
    expect(recordDetailsLink).to.exist;
  });
});

// write a suite for each type of vital

describe('Vital list item component for a type with no records', () => {
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
        record={{ type: vitalTypes.BLOOD_PRESSURE, noRecords: true }}
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

  it('should contain a no records message', () => {
    const recordName = screen.getByText(
      'There are no blood pressure results in your VA medical records.',
      { exact: true },
    );
    expect(recordName).to.exist;
  });

  it('should not contain the result of the record', () => {
    const recordName = screen.queryByText('Result');
    expect(recordName, screen.container).to.not.exist;
  });

  it('should not contain the date of the record', () => {
    const recordDate = screen.queryByText('Date');
    expect(recordDate, screen.container).to.not.exist;
  });

  it('should not contain a link to view record details', () => {
    const recordDetailsLink = screen.queryByText(
      'Review blood pressure over time',
    );
    expect(recordDetailsLink, screen.container).to.not.exist;
  });
});

describe('Vital List item for OH work', () => {
  it('should render "over time" text for all users', () => {
    const BLOOD_PRESSURE = vitals.entry[0].resource;
    const record = convertVital(BLOOD_PRESSURE);
    const options = { isAccelerating: false };
    const { getByRole } = render(
      <MemoryRouter initialEntries={[`/vitals`]}>
        <Route path="/vitals">
          <VitalListItem record={record} options={options} />
        </Route>
      </MemoryRouter>,
    );
    const link = getByRole('link', {
      name: /Review your blood pressure over time/i,
    });
    expect(link).to.exist;
  });
});
