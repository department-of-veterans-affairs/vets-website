import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import { recordType } from '../../util/constants';
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
        type={recordType.VACCINES}
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  };

  it('should contain the name of the record', () => {
    const screen = setup();
    const recordName = screen.getAllByText(
      'INFLUENZA, INJECTABLE, QUADRIVALENT',
      {
        exact: false,
      },
    );
    expect(recordName.length).to.equal(2);
  });

  it('should contain the date of the record', () => {
    const screen = setup();
    const recordDate = screen.getAllByText('August', { exact: false });
    expect(recordDate).to.exist;
  });

  it('should contain a link to view record details', () => {
    const screen = setup();
    const recordName = screen.getByRole('link');
    expect(recordName).to.exist;
  });
});
