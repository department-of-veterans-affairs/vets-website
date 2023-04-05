import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordListItem from '../../components/RecordList/RecordListItem';
import reducer from '../../reducers';
import vaccines from '../fixtures/vaccines.json';

describe('Vaccine list item component', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccinesList: vaccines,
        vaccineDetails: vaccines[0],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordListItem record={vaccines[0]} type="vaccine" />,
      {
        initialState: state,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('COVID-19 vaccine', { exact: true })).to.exist;
  });

  it('should contain the name and date of the record', () => {
    const screen = setup();
    const recordName = screen.getByText('COVID-19 vaccine', { exact: true });
    const recordDate = screen.getByText('June', { exact: false });
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
