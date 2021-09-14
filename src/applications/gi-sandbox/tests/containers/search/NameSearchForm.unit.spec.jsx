import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../../helpers';

import NameSearchForm from '../../../containers/search/NameSearchForm';

describe('<GiBillApp>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<NameSearchForm />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
