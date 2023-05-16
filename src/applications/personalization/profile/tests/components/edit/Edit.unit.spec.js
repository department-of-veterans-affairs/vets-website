import React from 'react';
import { expect } from 'chai';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { Edit } from '../../../components/edit/Edit';

describe('<Edit>', () => {
  it('renders with toggle `profileUseFieldEditingPage` turned ON and valid fieldName query present', () => {
    const view = renderWithStoreAndRouter(<Edit>test</Edit>, {
      initialState: {
        featureToggles: {
          [Toggler.TOGGLE_NAMES.profileUseFieldEditingPage]: true,
        },
      },
      path:
        '/profile/edit?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications',
    });

    expect(view.queryByText(/Sorry, this page is unavailable/i)).to.not.exist;

    expect(view.getByText('test')).to.exist;
    expect('Add or update your mobile phone number').to.exist;
  });

  it('renders fallback with toggle `profileUseFieldEditingPage` turned ON and invalid fieldName query present', () => {
    const view = renderWithStoreAndRouter(<Edit>test</Edit>, {
      initialState: {
        featureToggles: {
          [Toggler.TOGGLE_NAMES.profileUseFieldEditingPage]: true,
        },
      },
      path:
        '/profile/edit?fieldName=someFakeField&returnPath=%2Fprofile%2Fnotifications',
    });

    expect(view.queryByText(/Edit your profile information/i)).to.exist;
    expect(view.getByText(/Choose a section to get started/i)).to.exist;
  });

  // this should never happen, but just in case, we want to have some fallback behavior
  it('renders fallback with toggle `profileUseFieldEditingPage` turned OFF', () => {
    const view = renderWithStoreAndRouter(<Edit />, {
      initialState: {
        featureToggles: {
          [Toggler.TOGGLE_NAMES.profileUseFieldEditingPage]: false,
        },
      },
      path:
        '/profile/edit?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications',
    });

    expect(view.queryByText(/Edit your profile information/i)).to.exist;
    expect(view.getByText(/Choose a section to get started/i)).to.exist;
  });
});
