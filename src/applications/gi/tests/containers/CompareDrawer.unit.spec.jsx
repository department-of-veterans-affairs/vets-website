import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';
import CompareDrawer from '../../containers/CompareDrawer';

describe('<CompareDrawer>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<CompareDrawer />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
