import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import LicenseCertificationSearchResults from '../../containers/LicenseCertificationSearchResults';
import { renderWithStoreAndRouter } from '../helpers';

describe('<LicenseCertificationSearchResults />', () => {
  it('should render', async () => {
    const screen = renderWithStoreAndRouter(
      <LicenseCertificationSearchResults />,
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
