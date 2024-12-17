import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import LicenseCertificationSearchResult from '../../containers/LicenseCertificationSearchResult';
import { renderWithStoreAndRouter } from '../helpers';

describe('<LicenseCertificationSearchResult />', () => {
  it('should render', async () => {
    const result = {
      link: '/sample-link',
      type: 'Sample Type',
      name: 'Sample Name',
    };

    const screen = renderWithStoreAndRouter(
      <LicenseCertificationSearchResult result={result} />,
      {
        initialState: {
          hasFetchedResult: false,
          resultInfo: {},
        },
      },
    );

    await waitFor(() => {
      expect(screen).to.not.be.null;
    });
  });
});
