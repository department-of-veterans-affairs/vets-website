import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../../helpers';

import NameSearchResults from '../../../containers/search/NameSearchResults';

describe('<GiBillApp>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<NameSearchResults />, {
      initialState: {
        constants: mockConstants(),
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
