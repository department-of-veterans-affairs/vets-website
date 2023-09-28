import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import MedicationsListSort from '../../../components/MedicationsList/MedicationsListSort';
import { rxListSortingOptions } from '../../../util/constants';

describe('Medicaitons List Sort component', () => {
  const defaultSortOption = rxListSortingOptions[0].ACTIVE.value;
  const setSortOption = value => {
    return value;
  };
  const sortRxList = () => {};
  const setup = () => {
    return renderWithStoreAndRouter(
      <MedicationsListSort
        setSortOption={setSortOption}
        defaultSortOption={defaultSortOption}
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
});
