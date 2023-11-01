import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';
import TuitionAndHousingEstimates from '../../containers/TuitionAndHousingEstimates';

describe('<TuitionAndHousingEstimates>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<TuitionAndHousingEstimates />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
