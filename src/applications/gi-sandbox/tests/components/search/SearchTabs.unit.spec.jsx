import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '../../helpers';

import { waitFor } from '@testing-library/react';

import SearchTabs from '../../../components/search/SearchTabs';

describe('<SearchTabs>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <SearchTabs search={{ inProgress: false }} />,
      {},
    );

    await waitFor(() => {
      expect(screen.getByText('Search by name')).to.be.ok;
    });
  });
});
