import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import vapService from '~/platform/user/profile/vap-svc/reducers';

import { Edit } from '../../../components/edit/Edit';

describe('<Edit>', () => {
  it('renders form with valid fieldName query present', async () => {
    const view = renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications',
    });

    expect(await view.findByText('Add your mobile phone number')).to.exist;

    expect(await view.findByText('Mobile phone number (U.S. numbers only)')).to
      .exist;
  });

  it('renders fallback when invalid fieldName query present', async () => {
    const view = renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=someFakeField&returnPath=%2Fprofile%2Fnotifications',
    });

    expect(await view.findByText(/Edit your profile information/i)).to.exist;
    expect(await view.findByText(/Choose a section to get started/i)).to.exist;
  });

  it('renders fallback when invalid returnPath in query params', async () => {
    const view = renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path: '/profile/edit?fieldName=mobilePhone&returnPath=fakeReturnPath',
    });

    // breadcrumb should fall back to profile root
    expect(await view.findByText(/Back to profile/i)).to.exist;

    // since the fieldName is valid, we should still render the correct form
    expect(await view.findByText('Add your mobile phone number')).to.exist;
  });

  it('renders the "Update" heading when there is field data', async () => {
    const initialStateWithData = {
      user: {
        profile: {
          vapContactInfo: {
            mobilePhone: {
              areaCode: '123',
              phoneNumber: '4567890',
            },
          },
        },
      },
    };

    const viewWithData = renderWithStoreAndRouter(<Edit />, {
      initialState: initialStateWithData,
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications',
    });

    // Assuming fieldData is not empty, heading should start with 'Update'
    expect(await viewWithData.findByText('Update your mobile phone number')).to
      .exist;
  });
});
