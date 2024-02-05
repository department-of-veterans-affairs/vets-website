import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MedicationsListSort from '../../../components/MedicationsList/MedicationsListSort';
import { rxListSortingOptions } from '../../../util/constants';

describe('Medicaitons List Sort component', () => {
  const sortRxList = () => {};
  const setup = () => {
    return renderWithStoreAndRouter(
      <MedicationsListSort
        value={Object.keys(rxListSortingOptions)[0]}
        sortRxList={sortRxList}
      />,
      {
        path: '/',
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
  it('has a sort button', () => {
    const screen = setup();
    const sortButton = screen.getByTestId('sort-button');
    expect(sortButton).to.have.property('text', 'Sort');
  });
});
