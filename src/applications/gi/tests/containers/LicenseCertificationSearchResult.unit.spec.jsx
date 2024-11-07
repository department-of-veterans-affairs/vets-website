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

  // it('should show result info if hasFetchedResult is true', async () => {
  //   const result = {
  //     link: '/sample-link',
  //     type: 'Sample Type',
  //     name: 'Sample Name',
  //   };

  //   const resultInfo = {
  //     institution: {
  //       name: 'Sample Institution',
  //       phone: '123-456-7890',
  //       physicalStreet: '123 Main St',
  //       physicalCity: 'Sample City',
  //       physicalState: 'CA',
  //       physicalZip: '90210',
  //       physicalCountry: 'USA',
  //     },
  //     tests: [
  //       { name: 'Sample Test 1', fee: 200 },
  //       { name: 'Sample Test 2', fee: 300 },
  //     ],
  //   };

  //   const screen = renderWithStoreAndRouter(
  //     <LicenseCertificationSearchResult result={result} />,
  //     {
  //       initialState: {
  //         hasFetchedResult: true,
  //         resultInfo: resultInfo,
  //       },
  //     },
  //   );

  //   await waitFor(() => {
  //     const resultInfoComponent = screen.queryByText(/Loading/);
  //     expect(resultInfoComponent).to.be.null;
  //     expect(
  //       screen.getByText(/Physical address and mailing address are the same/),
  //     ).to.exist;
  //   });
  // });
});
