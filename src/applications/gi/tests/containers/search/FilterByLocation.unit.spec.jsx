import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
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
});
