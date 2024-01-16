import React from 'react';
import { expect } from 'chai';
import { renderWithProfileReducers } from '../../unit-test-helpers';

import DownloadPdf from '../../../components/military-information/DownloadPdf';

function createBasicInitialState() {
  return {
    user: {
      profile: {
        veteranStatus: {
          status: 'OK',
        },
      },
    },
    totalRating: {
      totalDisabilityRating: 40,
    },
    vaProfile: {
      hero: {
        userFullName: {
          first: 'Test',
          last: 'Test',
        },
      },
      personalInformation: {
        birthDate: '1986-05-06',
      },
      militaryInformation: {
        serviceHistory: {
          serviceHistory: [
            {
              branchOfService: 'Air Force',
              beginDate: '2009-04-12',
              endDate: '2013-04-11',
              personnelCategoryTypeCode: 'V',
            },
            {
              branchOfService: 'Air Force',
              beginDate: '2005-04-12',
              endDate: '2009-04-11',
              personnelCategoryTypeCode: 'A',
            },
          ],
        },
      },
    },
  };
}

describe('DownloadPdf', () => {
  const initialState = createBasicInitialState();

  it('should show download link for iOS device', () => {
    const view = renderWithProfileReducers(
      <DownloadPdf mockUserAgent="iPhone" />,
      { initialState },
    );
    const button = view.getAllByRole('button');
    expect(button.length).to.equal(1);
    view.unmount();
  });
  it('should show download link for android device', () => {
    const view = renderWithProfileReducers(
      <DownloadPdf mockUserAgent="android" />,
      { initialState },
    );
    const button = view.getAllByRole('button');
    expect(button.length).to.equal(1);
    view.unmount();
  });
  it('should show download button for non-mobile device', () => {
    const view = renderWithProfileReducers(<DownloadPdf />, { initialState });
    const link = view.getAllByRole('link');
    expect(link.length).to.equal(1);
    view.unmount();
  });
});
