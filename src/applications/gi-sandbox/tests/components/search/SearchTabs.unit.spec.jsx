import React from 'react';
import { expect } from 'chai';
import { mockConstants, renderWithStoreAndRouter } from '../../helpers';

import { waitFor } from '@testing-library/react';

import SearchTabs from '../../../components/search/SearchTabs';

describe('<SearchTabs>', () => {
  it.skip('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <SearchTabs />,

      {
        initialState: {
          constants: mockConstants(),
        },
      },
    );

    await waitFor(() => {
      expect(screen.getByText('Search by name')).to.be.ok;
    });
  });
});
