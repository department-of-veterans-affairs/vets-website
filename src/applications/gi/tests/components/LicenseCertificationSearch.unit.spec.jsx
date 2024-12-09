import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '../helpers';
import LicenseCertificationSearch from '../../components/LicenseCertificationSearch';

describe('<LicenseCertificationSearch />', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(<LicenseCertificationSearch />, {
      initialState: {
        fetchingLc: true,
        lcResults: [],
        hasFetchedOnce: false,
      },
    });

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
