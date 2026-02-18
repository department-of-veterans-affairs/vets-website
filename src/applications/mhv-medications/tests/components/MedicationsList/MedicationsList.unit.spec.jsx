import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import prescriptions from '../../fixtures/prescriptions.json';
import MedicationsList from '../../../components/MedicationsList/MedicationsList';
import reducer from '../../../reducers';
import {
  rxListSortingOptions,
  ALL_MEDICATIONS_FILTER_KEY,
} from '../../../util/constants';

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
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
    const fullState = {
      ...state,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
        ...state.featureToggles,
      },
      rx: {
        ...state.rx,
        preferences: {
          filterOption: ALL_MEDICATIONS_FILTER_KEY,
          ...state.rx?.preferences,
        },
      },
    };

    return renderWithStoreAndRouterV6(
      <MedicationsList
        rxList={prescriptions}
        pagination={pagination}
        setCurrentPage={setCurrentPage}
        selectedSortOption={sortOption}
      />,
      {
        initialState: fullState,
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
      'Showing 1 - 10 of 113  medications, alphabetically by status',
    );
  });

  it('shows different sorting selections', () => {
    const screen = setup(initialState, 'lastFilledFirst');

    const lastFilledFirst = screen.getByTestId('page-total-info');

    expect(lastFilledFirst).to.contain.text(
      rxListSortingOptions.lastFilledFirst.LABEL.toLowerCase(),
    );
  });

  it('applies correct aria-label for accessibility when cernerPilot flag is enabled', () => {
    const screen = setup(initialState, 'alphabeticallyByStatus', true);
    const paginationInfo = screen.getByTestId('page-total-info');
    expect(paginationInfo).to.have.attribute(
      'aria-label',
      'Showing 1 - 10 of 113 medications, alphabetically by status',
    );
  });

  it('applies correct aria-label for accessibility', () => {
    const screen = setup();
    const paginationInfo = screen.getByTestId('page-total-info');
    expect(paginationInfo).to.have.attribute(
      'aria-label',
      'Showing 1 - 10 of 113 medications, alphabetically by status',
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
  describe('dual flag requirement validation', () => {
    const FLAG_COMBINATIONS = [
      {
        cernerPilot: false,
        v2StatusMapping: false,
        desc: 'both flags disabled',
      },
      {
        cernerPilot: true,
        v2StatusMapping: false,
        desc: 'only cernerPilot enabled',
      },
      {
        cernerPilot: false,
        v2StatusMapping: true,
        desc: 'only v2StatusMapping enabled',
      },
      {
        cernerPilot: true,
        v2StatusMapping: true,
        desc: 'both flags enabled',
      },
    ];

    FLAG_COMBINATIONS.forEach(({ cernerPilot, v2StatusMapping, desc }) => {
      it(`renders correctly when ${desc}`, () => {
        const screen = setup(
          initialState,
          'alphabeticallyByStatus',
          cernerPilot,
          v2StatusMapping,
        );
        expect(screen.getByTestId('page-total-info')).to.exist;
      });
    });
  });
});
