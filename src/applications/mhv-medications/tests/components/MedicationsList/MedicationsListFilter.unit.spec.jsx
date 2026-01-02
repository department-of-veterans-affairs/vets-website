import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import * as reactRedux from 'react-redux';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import MedicationsListFilter from '../../../components/MedicationsList/MedicationsListFilter';
import reducer from '../../../reducers';
import {
  ACTIVE_FILTER_KEY,
  ALL_MEDICATIONS_FILTER_KEY,
  IN_PROGRESS_FILTER_KEY,
  filterOptions,
  filterOptionsV2,
} from '../../../util/constants';

let sandbox;

describe('Medications List Filter component', () => {
  const filterCountObj = {
    allMedications: 466,
    active: 58,
    recentlyRequested: 43,
    renewal: 29,
    nonActive: 403,
    inactive: 403, // V2 version of nonActive
    inProgress: 25,
    shipped: 12,
    transferred: 8,
    statusNotAvailable: 5,
  };

  let dispatchSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    dispatchSpy = sandbox.spy();
    sandbox.stub(reactRedux, 'useDispatch').returns(dispatchSpy);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const setup = (
    initialState = {},
    updateFilter,
    filterCount = filterCountObj,
    isCernerPilot = false,
    isV2StatusMapping = false,
  ) => {
    const state = {
      ...initialState,
      featureToggles: {
        [FEATURE_FLAG_NAMES.mhvMedicationsCernerPilot]: isCernerPilot,
        [FEATURE_FLAG_NAMES.mhvMedicationsV2StatusMapping]: isV2StatusMapping,
        ...initialState.featureToggles,
      },
    };

    return renderWithStoreAndRouterV6(
      <MedicationsListFilter
        filterCount={filterCount}
        updateFilter={updateFilter}
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

  it('renders accordion', () => {
    const screen = setup();
    const accordion = screen.getByTestId('filter-accordion');
    expect(accordion).to.exist;
  });

  it('checks radio button that matches filter option', () => {
    const screen = setup({
      rx: {
        preferences: {
          filterOption: ACTIVE_FILTER_KEY,
        },
      },
    });

    const radioOptionChecked = screen.getByTestId('filter-option-ACTIVE');
    const radioOptionUnchecked = screen.getByTestId('filter-option-RENEWAL');

    expect(radioOptionChecked).to.exist;
    expect(radioOptionUnchecked).to.exist;

    expect(radioOptionChecked).to.have.property('checked', true);
    expect(radioOptionUnchecked).to.have.property('checked', false);
  });

  it('calls updateFilter when user presses the Filter button ', () => {
    const updateFilter = sandbox.spy();
    const screen = setup(
      {
        rx: { preferences: { filterOption: ACTIVE_FILTER_KEY } },
      },
      updateFilter,
    );

    const radioOptionChecked = screen.getByTestId('filter-option-ACTIVE');
    expect(radioOptionChecked).to.exist;

    const filterButton = screen.getByTestId('filter-button');
    filterButton.click();

    expect(updateFilter.calledOnce).to.be.true;
  });

  it('calls setFilterOption AND updateFilter when user presses the Reset button', () => {
    const updateFilter = sandbox.spy();
    const screen = setup(
      {
        rx: { preferences: { filterOption: filterOptions.ACTIVE.label } },
      },
      updateFilter,
    );

    const resetButton = screen.getByTestId('filter-reset-button');
    resetButton.click();

    // Verify updateFilter prop was called
    expect(updateFilter.calledWith(ALL_MEDICATIONS_FILTER_KEY)).to.be.true;
  });

  // Shared test data
  const FLAG_COMBINATIONS = [
    {
      cernerPilot: false,
      v2StatusMapping: false,
      useV2: false,
      desc: 'both flags disabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: false,
      useV2: false,
      desc: 'only cernerPilot enabled',
    },
    {
      cernerPilot: false,
      v2StatusMapping: true,
      useV2: false,
      desc: 'only v2StatusMapping enabled',
    },
    {
      cernerPilot: true,
      v2StatusMapping: true,
      useV2: true,
      desc: 'both flags enabled',
    },
  ];

  describe('filter options based on flag combinations', () => {
    FLAG_COMBINATIONS.forEach(
      ({ cernerPilot, v2StatusMapping, useV2, desc }) => {
        describe(`when ${desc}`, () => {
          it('shows correct filter options', () => {
            const screen = setup(
              {},
              () => {},
              filterCountObj,
              cernerPilot,
              v2StatusMapping,
            );

            // V2-only options
            if (useV2) {
              expect(screen.getByTestId('filter-option-IN_PROGRESS')).to.exist;
              expect(screen.getByTestId('filter-option-SHIPPED')).to.exist;
              expect(screen.getByTestId('filter-option-TRANSFERRED')).to.exist;
              expect(screen.getByTestId('filter-option-INACTIVE')).to.exist;
              expect(screen.getByTestId('filter-option-STATUS_NOT_AVAILABLE'))
                .to.exist;
              expect(screen.queryByTestId('filter-option-RECENTLY_REQUESTED'))
                .to.not.exist;
              expect(screen.queryByTestId('filter-option-NON_ACTIVE')).to.not
                .exist;
            } else {
              expect(screen.getByTestId('filter-option-RECENTLY_REQUESTED')).to
                .exist;
              expect(screen.queryByTestId('filter-option-IN_PROGRESS')).to.not
                .exist;
              expect(screen.queryByTestId('filter-option-SHIPPED')).to.not
                .exist;
            }

            // Common options
            expect(screen.getByTestId('filter-option-ACTIVE')).to.exist;
          });

          if (useV2) {
            it('shows correct V2 filter descriptions', () => {
              const screen = setup(
                {},
                () => {},
                filterCountObj,
                cernerPilot,
                v2StatusMapping,
              );
              const inProgressOption = screen.getByTestId(
                'filter-option-IN_PROGRESS',
              );
              expect(inProgressOption).to.have.attribute(
                'description',
                filterOptionsV2[IN_PROGRESS_FILTER_KEY].description,
              );
            });
          }
        });
      },
    );
  });

  describe('Filter count mapping', () => {
    it('uses V1 filter count keys when BOTH CernerPilot and V2StatusMapping flags disabled', () => {
      const v1FilterCount = {
        allMedications: 100,
        active: 20,
        recentlyRequested: 15,
        renewal: 10,
        nonActive: 55,
      };
      const screen = setup({}, () => {}, v1FilterCount, false, false);
      expect(screen.getByTestId('filter-option-RECENTLY_REQUESTED')).to.exist;
      expect(screen.getByTestId('filter-option-NON_ACTIVE')).to.exist;
    });

    it('uses V2 filter count keys when BOTH CernerPilot and V2StatusMapping flags enabled', () => {
      const v2FilterCount = {
        allMedications: 100,
        active: 20,
        inProgress: 15,
        shipped: 10,
        inactive: 45,
        transferred: 5,
        statusNotAvailable: 5,
      };
      const screen = setup({}, () => {}, v2FilterCount, true, true);
      expect(screen.getByTestId('filter-option-IN_PROGRESS')).to.exist;
      expect(screen.getByTestId('filter-option-SHIPPED')).to.exist;
      expect(screen.getByTestId('filter-option-INACTIVE')).to.exist;
    });
  });
});
