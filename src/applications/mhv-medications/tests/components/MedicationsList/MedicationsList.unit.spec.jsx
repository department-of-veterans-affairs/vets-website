import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import prescriptions from '../../fixtures/prescriptions.json';
import MedicationsList from '../../../components/MedicationsList/MedicationsList';
import reducer from '../../../reducers';
import { rxListSortingOptions } from '../../../util/constants';

describe('Medications List component', () => {
  const initialState = {
    rx: {
      prescriptions,
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

  const setup = (
    state = initialState,
    sortOption = 'alphabeticallyByStatus',
  ) => {
    return renderWithStoreAndRouterV6(
      <MedicationsList
        rxList={prescriptions}
        pagination={pagination}
        setCurrentPage={setCurrentPage}
        selectedSortOption={sortOption}
      />,
      {
        initialState: state,
        reducers: reducer,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('displays pagination list data ie Showing 1 - 20 of 113 medications', () => {
    const screen = setup();
    const paginationInfo = screen.getByTestId('page-total-info');

    expect(paginationInfo).to.exist;
  });

  it('shows sorting selection', () => {
    const screen = setup();
    const paginationInfo = screen.getByTestId('page-total-info');

    expect(paginationInfo).to.contain.text(
      'Showing 1 - 20 of 113  medications, alphabetically by status',
    );
  });

  it('shows different sorting selections', () => {
    const screen = setup(initialState, 'lastFilledFirst');

    const lastFilledFirst = screen.getByTestId('page-total-info');

    expect(lastFilledFirst).to.contain.text(
      rxListSortingOptions.lastFilledFirst.LABEL.toLowerCase(),
    );
  });
  it('shows "Showing 0-0" when an empty list is passed', () => {
    const screen = renderWithStoreAndRouterV6(
      <MedicationsList
        rxList={[]}
        pagination={pagination}
        setCurrentPage={setCurrentPage}
      />,
      {
        initialState: {
          rx: {
            prescriptions: { prescriptionDetails: { prescriptionId: 123 } },
          },
        },
        reducers: reducer,
      },
    );
    const numToNums = screen.getByTestId('page-total-info');
    expect(numToNums).to.contain.text('Showing 0 - 0');
  });
});
