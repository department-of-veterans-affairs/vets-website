import React from 'react';
import { expect } from 'chai';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';
import vapService from '~/platform/user/profile/vap-svc/reducers';
import { waitFor } from '@testing-library/dom';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { Edit } from '../../../components/edit/Edit';

describe('<Edit>', () => {
  it('renders form with valid fieldName query present', async () => {
    const view = renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications',
    });

    // Assuming fieldData is empty, heading should start with 'Add' and be focused
    const heading = await view.findByText('Add your mobile phone number');
    expect(heading).to.exist;
    expect(document.activeElement).to.equal(heading);

    expect(await view.container.innerHTML).to.contain('Mobile phone number');
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

    // breadcrumb should fall back to profile root (va-link uses shadow DOM)
    const backLink = $('va-link', view.container);
    expect(backLink).to.exist;
    expect(backLink.getAttribute('text')).to.match(/Back to profile/i);

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

    // Assuming fieldData is not empty, heading should start with 'Update' and be focused
    const heading = await viewWithData.findByText(
      'Update your mobile phone number',
    );
    expect(heading).to.exist;
    expect(document.activeElement).to.equal(heading);
  });

  it('renders path name in breadcrumb', () => {
    const { getByRole, findByText } = renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=email&returnPath=%2Fprofile%2Fpersonal-information',
    });

    expect(getByRole('navigation')).to.exist;
    expect(findByText(/Back to personal information/i)).to.exist;
  });

  it('renders path name in body', () => {
    const { getByText } = renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=email&returnPath=%2Fprofile%2Fpersonal-information',
    });

    expect(getByText('PERSONAL INFORMATION', { exact: true })).to.exist;
  });

  it('sets correct page title when field is empty', async () => {
    renderWithStoreAndRouter(<Edit />, {
      initialState: {},
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=email&returnPath=%2Fprofile%2Fpaperless-delivery',
    });

    await waitFor(() => {
      expect(document.title).to.equal(
        'Add your contact email address | Veterans Affairs',
      );
    });
  });

  it('sets correct page title when field is not empty', async () => {
    renderWithStoreAndRouter(<Edit />, {
      initialState: {
        user: {
          profile: {
            vapContactInfo: {
              email: {
                emailAddress: 'someuser@somedomain.com',
              },
            },
          },
        },
      },
      reducers: { vapService },
      path:
        '/profile/edit?fieldName=email&returnPath=%2Fprofile%2Fpaperless-delivery',
    });

    await waitFor(() => {
      expect(document.title).to.equal(
        'Update your contact email address | Veterans Affairs',
      );
    });
  });
});
