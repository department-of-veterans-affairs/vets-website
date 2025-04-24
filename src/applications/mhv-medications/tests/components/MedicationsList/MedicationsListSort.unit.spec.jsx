import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MedicationsListSort from '../../../components/MedicationsList/MedicationsListSort';
import { rxListSortingOptions } from '../../../util/constants';

describe('Medications List Sort component', () => {
  const sortRxList = () => {};
  const setup = (initialState = {}) => {
    return renderWithStoreAndRouterV6(
      <MedicationsListSort
        value={Object.keys(rxListSortingOptions)[0]}
        sortRxList={sortRxList}
      />,
      {
        state: initialState,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
  });

  it('has the same number of list options as preset constant rxSortingListOptions', () => {
    const screen = setup();

    const sortOptions = screen.getAllByTestId('sort-option');
    expect(sortOptions.length).to.equal(
      Object.keys(rxListSortingOptions).length,
    );
  });
});
