import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '../helpers';

import PreviewBanner from '../../components/PreviewBanner';

describe('<PreviewBanner>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <PreviewBanner version="TEST_ID" />,
      {},
    );

    await waitFor(() => {
      expect(screen.getByText('View live version')).to.be.ok;
    });
  });
});
