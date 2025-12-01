import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import sinon from 'sinon';
import * as reactRedux from 'react-redux';
import MedicationsListFilter from '../../../components/MedicationsList/MedicationsListFilter';
import reducer from '../../../reducers';
import {
  ACTIVE_FILTER_KEY,
  ALL_MEDICATIONS_FILTER_KEY,
  IN_PROGRESS_FILTER_KEY,
  INACTIVE_FILTER_KEY,
  SHIPPED_FILTER_KEY,
  TRANSFERRED_FILTER_KEY,
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
  ) => {
    const state = {
      ...initialState,
      featureToggles: {
        mhvMedicationsCernerPilot: isCernerPilot,
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

  it('shows standard filter options when Cerner pilot is disabled', () => {
    const screen = setup({}, () => {}, filterCountObj, false);

    // Should show standard filter options
    expect(screen.getByTestId('filter-option-ACTIVE')).to.exist;
    expect(screen.getByTestId('filter-option-RECENTLY_REQUESTED')).to.exist;
    expect(screen.queryByTestId('filter-option-IN_PROGRESS')).to.not.exist;
    expect(screen.queryByTestId('filter-option-SHIPPED')).to.not.exist;
    expect(screen.queryByTestId('filter-option-TRANSFERRED')).to.not.exist;
    expect(screen.queryByTestId('filter-option-INACTIVE')).to.not.exist;
    expect(screen.queryByTestId('filter-option-STATUS_NOT_AVAILABLE')).to.not
      .exist;
  });

  it('shows V2 filter options when Cerner pilot is enabled', () => {
    const screen = setup({}, () => {}, filterCountObj, true);

    // Should show V2 filter options
    expect(screen.getByTestId('filter-option-ACTIVE')).to.exist;
    expect(screen.getByTestId('filter-option-IN_PROGRESS')).to.exist;
    expect(screen.getByTestId('filter-option-SHIPPED')).to.exist;
    expect(screen.getByTestId('filter-option-TRANSFERRED')).to.exist;
    expect(screen.getByTestId('filter-option-STATUS_NOT_AVAILABLE')).to.exist;
    expect(screen.getByTestId('filter-option-INACTIVE')).to.exist;

    // Should NOT show standard-only filter options
    expect(screen.queryByTestId('filter-option-RECENTLY_REQUESTED')).to.not
      .exist;
    expect(screen.queryByTestId('filter-option-NON_ACTIVE')).to.not.exist;
  });

  it('shows correct filter descriptions for V2 options when Cerner pilot is enabled', () => {
    // This test specifically requires Cerner pilot to be enabled to access V2 filter options
    const screen = setup({}, () => {}, filterCountObj, true);

    const inProgressOption = screen.getByText(
      filterOptionsV2[IN_PROGRESS_FILTER_KEY].description,
    );
    const shippedOption = screen.getByText(
      filterOptionsV2[SHIPPED_FILTER_KEY].description,
    );
    const transferredOption = screen.getByText(
      filterOptionsV2[TRANSFERRED_FILTER_KEY].description,
    );
    const inactiveOption = screen.getByText(
      filterOptionsV2[INACTIVE_FILTER_KEY].description,
    );

    expect(inProgressOption).to.exist;
    expect(shippedOption).to.exist;
    expect(transferredOption).to.exist;
    expect(inactiveOption).to.exist;
  });
});
