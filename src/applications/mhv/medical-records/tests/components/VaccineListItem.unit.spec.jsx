import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import { RecordType } from '../../util/constants';
import vaccines from '../fixtures/vaccines.json';
import { convertVaccine } from '../../reducers/vaccines';

describe('VaccineListItem', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccinesList: vaccines.entry.map(item => convertVaccine(item.resource)),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem
        record={convertVaccine(vaccines.entry[0].resource)}
        type={RecordType.VACCINES}
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(
      screen.getByText('INFLUENZA, INJECTABLE, QUADRIVALENT', { exact: true }),
    ).to.exist;
  });

  it('should contain the name of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('INFLUENZA, INJECTABLE, QUADRIVALENT', {
      exact: true,
    });
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const screen = setup();
    const recordDate = screen.getByText('August', { exact: false });
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
