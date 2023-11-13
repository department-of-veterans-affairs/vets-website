import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { mockConstants, renderWithStoreAndRouter } from '../helpers';

import GiBillApp from '../../containers/GiBillApp';

describe('<GiBillApp>', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<GiBillApp />, {
      initialState: {
        constants: mockConstants(),
      },
    });
    await waitFor(() => {
      expect(screen.getByRole('application')).to.be.ok;
    });
  });

  it('should render after running shouldExitPreviewMode()', async () => {
    const screen = renderWithStoreAndRouter(
      <GiBillApp TESTVERSION TESTQUERYPARAMS={false} />,
      {
        initialState: {
          preview: {
            display: true,
            version: {
              id: null,
            },
          },
        },
      },
    );
    await waitFor(() => {
      expect(screen.getByRole('application')).to.be.ok;
    });
  });
});
