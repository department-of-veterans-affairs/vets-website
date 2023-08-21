import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import labsAndTests from '../fixtures/labsAndTests.json';
import { RecordType } from '../../util/constants';

describe('LabsAndTestsListItem component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[0]),
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[0])}
        type={RecordType.LABS_AND_TESTS}
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(
      screen.getAllByText(
        'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
        { exact: true },
      )[0],
    ).to.exist;
  });

  it('should contain the name and date of the record', () => {
    const screen = setup();
    const recordName = screen.getAllByText(
      'POTASSIUM:SCNC:PT:SER/PLAS:QN:, SODIUM:SCNC:PT:SER/PLAS:QN:',
      {
        exact: true,
      },
    )[0];
    const recordDate = screen.getByText('January', { exact: false });
    expect(recordName).to.exist;
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
