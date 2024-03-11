import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import prescriptions from '../../fixtures/prescriptions.json';
import MedicationsList from '../../../components/MedicationsList/MedicationsList';
import reducer from '../../../reducers';
import { rxListSortingOptions } from '../../../util/constants';

describe('Medicaitons List component', () => {
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

  const setup = (state = initialState, sortOption = 'lastFilledFirst') => {
    return renderWithStoreAndRouter(
      <MedicationsList
        rxList={prescriptions}
        pagination={pagination}
        setCurrentPage={setCurrentPage}
        selectedSortOption={sortOption}
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

  it('displays pagination list data ie Showing 1 - 20 of 113 medications', () => {
    const screen = setup();
    const paginationInfo = screen.getByTestId('page-total-info');

    expect(paginationInfo).to.exist;
  });

  it('shows sorting selection', () => {
    const screen = setup();
    const paginationInfo = screen.getByTestId('page-total-info');

    expect(paginationInfo).to.contain.text(
      'Showing 1 - 20 of 113 medications, last filled first',
    );
  });

  it('shows different sorting selections', () => {
    const screen = setup(initialState, 'alphabeticallyByStatus');

    const alphabeticallyByStatus = screen.getByTestId('page-total-info');

    expect(alphabeticallyByStatus).to.contain.text(
      rxListSortingOptions.alphabeticallyByStatus.LABEL.toLowerCase(),
    );
  });
  it('shows "Showing 0-0" when an empty list is passed', () => {
    const screen = (state = initialState, sortOption = 'lastFilledFirst') => {
      return renderWithStoreAndRouter(
        <MedicationsList
          rxList={[]}
          pagination={pagination}
          setCurrentPage={setCurrentPage}
          selectedSortOption={sortOption}
        />,
        {
          initialState: {
            ...state,
            rx: {
              prescriptions: { prescriptionDetails: { prescriptionId: 123 } },
            },
          },
          reducers: reducer,
          path: '/',
        },
      );
    };
    const numToNums = screen().getByTestId('page-total-info');
    expect(numToNums).to.contain.text('Showing 0 - 0');
  });
});
