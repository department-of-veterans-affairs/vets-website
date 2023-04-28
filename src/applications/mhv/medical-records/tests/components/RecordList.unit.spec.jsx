import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import RecordList from '../../components/RecordList/RecordList';
import vaccines from '../fixtures/vaccines.json';
import reducer from '../../reducers';
import { RecordType } from '../../util/constants';

describe('Record list component', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccinesList: vaccines,
        vaccineDetails: vaccines[0],
      },
    },
  };
  let screen = null;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordList records={vaccines} type={RecordType.VACCINES} />,
      {
        initialState,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getByText('Showing', { exact: false })).to.exist;
  });

  it('displays a list of records when records are provided', async () => {
    await waitFor(() => {
      // 20 because 10 (paginated) for regular view plus 10 (unpaginated) for print view
      expect(screen.getAllByTestId('record-list-item')).to.have.length(20);
    });
  });
});
