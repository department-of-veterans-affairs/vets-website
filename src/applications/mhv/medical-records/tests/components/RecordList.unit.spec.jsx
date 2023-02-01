import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import RecordList from '../../components/RecordList';
import vaccines from '../fixtures/vaccines.json';
import reducer from '../../reducers';

describe('Record list component', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccineList: vaccines,
        vaccineDetails: vaccines[0],
      },
    },
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <RecordList records={vaccines} type="vaccines" />,
      {
        initialState: state,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen.getByText('Displaying', { exact: false })).to.exist;
  });

  it('displays a list of records when records are provided', async () => {
    const screen = setup();
    const recordItems = await screen.getAllByTestId('record-list-item');
    expect(recordItems.length).to.equal(5);
  });
});
