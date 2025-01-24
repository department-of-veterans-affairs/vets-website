import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '../helpers';
import LicenseCertificationSearchPage from '../../components/LicenseCertificationSearchPage';

describe('<LicenseCertificationSearchPage />', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <LicenseCertificationSearchPage />,
      {
        initialState: {
          fetchingLc: true,
          lcResults: [],
          hasFetchedOnce: false,
        },
      },
    );

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
