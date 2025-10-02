import { expect } from 'chai';
import React from 'react';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import reducer from '../../../reducers';
import { rxListSortingOptions } from '../../../util/constants';
import MedicationsListSort from '../../../components/MedicationsList/MedicationsListSort';

describe('Medications List Sort component', () => {
  const setup = (shouldShowSelect = true) => {
    return renderWithStoreAndRouterV6(
      <MedicationsListSort shouldShowSelect={shouldShowSelect} />,
      {
        reducers: reducer,
      },
    );
  };

  it('renders without errors', () => {
    const screen = setup();
    expect(screen);
    expect(screen.getByTestId('sort-dropdown')).to.exist;
    expect(screen.getByTestId('sort-action-sr-text')).to.exist;
  });

  it('renders without a select element if shouldShowSelect is false', () => {
    const screen = setup(false);
    expect(screen);
    expect(screen.queryByTestId('sort-dropdown')).not.to.exist;
    expect(screen.getByTestId('sort-action-sr-text')).to.exist;
  });

  it('has the same number of list options as preset constant rxSortingListOptions', () => {
    const screen = setup();

    const sortOptions = screen.getAllByTestId('sort-option');
    expect(sortOptions.length).to.equal(
      Object.keys(rxListSortingOptions).length,
    );
  });
});
