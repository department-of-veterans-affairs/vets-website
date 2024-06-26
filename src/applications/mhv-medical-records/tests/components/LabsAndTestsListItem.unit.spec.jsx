import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import { convertLabsAndTestsRecord } from '../../reducers/labsAndTests';
import labsAndTests from '../fixtures/labsAndTests.json';
import { recordType } from '../../util/constants';

describe('LabsAndTestsListItem component', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[0]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[0])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getAllByText('Potassium', { exact: true })[0]).to.exist;
  });

  it('should contain the name of the record', () => {
    const recordName = screen.getAllByText('Potassium', {
      exact: true,
    })[0];
    expect(recordName).to.exist;
  });

  it('should contain the date of the record', () => {
    const date = screen.getAllByText('January 20, 2021, 4:38 p.m.', {
      exact: false,
    });
    expect(date.length).to.eq(2);
  });

  it('should contain a link to view record details', () => {
    const recordDetailsLink = screen.getByText('Potassium', {
      selector: 'span',
      exact: true,
    });
    expect(recordDetailsLink).to.exist;
  });
});

describe('LabsAndTestsListItem component with chem/hem record', () => {
  const initialState = {
    mr: {
      labsAndTests: {
        labsAndTestsList: labsAndTests,
        labsAndTestsDetails: convertLabsAndTestsRecord(labsAndTests.entry[0]),
      },
    },
  };

  let screen;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordListItem
        record={convertLabsAndTestsRecord(labsAndTests.entry[0])}
        type={recordType.LABS_AND_TESTS}
      />,
      {
        initialState,
        reducers: reducer,
        path: '/labs-and-tests',
      },
    );
  });

  it('should display the chem/hem date label', () => {
    expect(screen.getAllByText('Date and time collected: ', { exact: false }))
      .to.exist;
  });
});
