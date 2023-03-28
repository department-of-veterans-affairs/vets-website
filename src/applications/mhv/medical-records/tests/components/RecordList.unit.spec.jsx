import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import RecordList from '../../components/RecordList/RecordList';
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
  let screen = null;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordList records={vaccines} type="vaccine" />,
      {
        initialState,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getByText('Displaying', { exact: false })).to.exist;
  });

  it('displays a list of records when records are provided', async () => {
    await waitFor(() => {
      // 15 because 5 (paginated) for regular view plus 10 (unpaginated) for print view
      expect(screen.getAllByTestId('record-list-item')).to.have.length(15);
    });
  });
});
