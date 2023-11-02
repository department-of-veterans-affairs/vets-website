import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';
import FilterYourResults from '../../containers/FilterYourResults';

describe('<FilterYourResults>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<FilterYourResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
