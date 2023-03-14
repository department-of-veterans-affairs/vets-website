import React from 'react';
import { expect } from 'chai';
import { Toggler } from '~/applications/personalization/components/Toggler';
import { renderWithStoreAndRouter } from '~/platform/testing/unit/react-testing-library-helpers';

import { Edit } from '../../../components/edit/Edit';

const setup = ({ toggleEnabled = false }) => {
  return renderWithStoreAndRouter(<Edit />, {
    initialState: {
      featureToggles: {
        [Toggler.TOGGLE_NAMES.profileUseFieldEditingPage]: toggleEnabled,
      },
    },
    path:
      '/profile/edit?fieldName=mobilePhone&returnPath=%2Fprofile%2Fnotifications',
  });
};

describe('<Edit> renders without crashing', () => {
  it('renders with toggle `profileUseFieldEditingPage` turned ON', () => {
    const view = setup({ toggleEnabled: true });

    expect(view.queryByText(/Sorry, this page is unavailable/i)).to.not.exist;

    expect(view.getByText('mobilePhone')).to.exist;

    // renders the link to return to previous page
    expect(view.getByText(/Return to Notification settings/i)).to.exist;
  });

  // this should never happen, but just in case, we want to have some fallback behavior
  it('renders with toggle `profileUseFieldEditingPage` turned OFF', () => {
    const view = setup({ toggleEnabled: false });

    expect(view.queryByText(/Sorry, this page is unavailable/i)).to.exist;

    // renders the link to return to previous page
    expect(view.queryByText(/Return to Notification settings/i)).to.not.exist;
  });
});
