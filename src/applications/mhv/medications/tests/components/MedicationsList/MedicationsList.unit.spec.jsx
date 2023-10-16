import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import prescriptions from '../../fixtures/prescriptions.json';
import MedicationsList from '../../../components/MedicationsList/MedicationsList';
import reducer from '../../../reducers';

describe('Medicaitons List component', () => {
  const initialState = {
    rx: {
      prescriptions: {},
    },
  };
  const pagination = {
    currentPage: 1,
    perPage: 20,
    totalPages: 12,
    totalEntries: 113,
  };
  const setCurrentPage = () => {
    return 1;
  };

  const setup = (state = initialState) => {
    return renderWithStoreAndRouter(
      <MedicationsList
        rxList={prescriptions}
        pagination={pagination}
        setCurrentPage={setCurrentPage}
        selectedSortOption="lastFilledFirst"
      />,
      {
        initialState: state,
        reducers: reducer,
        path: '/',
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays pagination list data ie Showing 1 - 20 of 20 medications', () => {
    const screen = setup();
    expect(screen.findByText('Showing 1 - 20 of 20 medications'));
  });
});
