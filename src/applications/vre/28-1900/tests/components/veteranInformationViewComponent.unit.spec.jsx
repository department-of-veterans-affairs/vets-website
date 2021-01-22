import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { expect } from 'chai';
import VeteranInformationViewComponent from 'applications/vre/28-1900/components/VeteranInformationViewComponent';

describe('Static Veteran Information', () => {
  it('should render veteran information', async () => {
    const initialState = {
      user: {
        profile: {
          dob: '1980-12-31',
          gender: 'M',
          userFullName: {
            first: 'MIKE',
            middle: 'M',
            last: 'Wazowski',
            suffix: 'III',
          },
        },
      },
    };
    const screen = renderInReduxProvider(<VeteranInformationViewComponent />, {
      initialState,
    });
    expect(await screen.findByText(/MIKE Wazowski/)).to.exist;
    expect(screen.getByText(/Date of birth: December 31st 1980/)).to.exist;
    expect(screen.getByText(/Gender: Male/)).to.exist;
  });
});
