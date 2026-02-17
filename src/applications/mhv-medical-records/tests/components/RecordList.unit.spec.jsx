import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { beforeEach } from 'mocha';
import { waitFor } from '@testing-library/react';
import RecordList from '../../components/RecordList/RecordList';
import reducer from '../../reducers';
import { recordType } from '../../util/constants';

const vaccines = [
  {
    id: '957',
    name: 'INFLUENZA, INJECTABLE, QUADRIVALENT',
    date: 'August 5, 2022',
    location: 'None recorded',
    manufacturer: 'None recorded',
    reactions: ['FEVER'],
    notes: ['test comment'],
  },
  {
    id: '956',
    name: 'COVID-19 (MODERNA), MRNA, LNP-S, PF, 100 MCG/0.5ML DOSE OR 50 MCG/0.25ML DOSE',
    date: 'August 8, 2022',
    location: 'None recorded',
    manufacturer: 'None recorded',
    reactions: [],
    notes: ['test'],
  },
];

describe('Record list component', () => {
  const initialState = {
    mr: {
      vaccines: {
        vaccinesList: vaccines,
      },
    },
  };
  let screen = null;
  beforeEach(() => {
    screen = renderWithStoreAndRouter(
      <RecordList records={vaccines} type={recordType.VACCINES} />,
      {
        initialState,
        reducers: reducer,
        path: '/vaccines',
      },
    );
  });

  it('renders without errors', () => {
    expect(screen.getAllByText('Showing', { exact: false }).length).to.eq(2);
  });

  it('displays a list of records when records are provided', async () => {
    await waitFor(() => {
      // 4 because 2 for the regular view plus 2 for the print view
      expect(screen.getAllByTestId('record-list-item')).to.have.length(4);
    });
  });

  it('renders records in semantic list elements for accessibility', async () => {
    await waitFor(() => {
      const lists = screen.container.querySelectorAll('ul.record-list-items');
      // 2 lists: one for no-print view and one for print-only view
      expect(lists).to.have.length(2);

      // Each list should contain li elements
      lists.forEach(list => {
        const listItems = list.querySelectorAll('li');
        expect(listItems.length).to.be.greaterThan(0);
      });
    });
  });
});
