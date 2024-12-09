import React from 'react';
import { expect } from 'chai';
import { waitFor, fireEvent } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../../helpers';
import FilterByLocation from '../../../containers/search/FilterByLocation';

describe('<FilterByLocation>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<FilterByLocation />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });

  it('should click and open the filter by location button then find the update results button and click it', async () => {
    const search = {
      tab: null,
    };
    const screen = renderWithStoreAndRouter(
      <FilterByLocation search={search} />,
      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );
    const FilterByLocationButton = screen.getByTestId('update-tuition-housing');
    fireEvent.click(FilterByLocationButton); // opens Filter by Location

    const UpdateResultsButton = screen.getByTestId('update-tuition-housing');
    fireEvent.click(UpdateResultsButton); // clicks on Update Results

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
