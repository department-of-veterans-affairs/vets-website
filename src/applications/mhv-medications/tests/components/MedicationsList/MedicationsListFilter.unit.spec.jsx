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
  filterOptions,
} from '../../../util/constants';

let sandbox;

describe('Medications List Filter component', () => {
  const filterCountObj = {
    allMedications: 466,
    active: 58,
    recentlyRequested: 43,
    renewal: 29,
    nonActive: 403,
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
  ) => {
    return renderWithStoreAndRouterV6(
      <MedicationsListFilter
        filterCount={filterCount}
        updateFilter={updateFilter}
      />,
      {
        initialState,
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
});
