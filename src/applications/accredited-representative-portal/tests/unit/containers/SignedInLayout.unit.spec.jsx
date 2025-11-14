import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from '~/platform/site-wide/feature-toggles/actionTypes';
import { renderTestApp } from '../helpers';
import SignedInLayout, {
  NoPOAPermissionsAlert,
} from '../../../containers/SignedInLayout';

describe('SignedInLayout', () => {
  it('renders loading when pilot feature toggle is loading', () => {
    const { getByTestId } = renderTestApp(<SignedInLayout />);

    expect(getByTestId('signed-in-layout-pilot-toggle-loading')).to.exist;
  });

  // Bring this back once we aren't hard coding hasPOAPermissions
  it.skip('renders alert when user does not have the necessary permissions to manage POA Requests', () => {
    const { getByTestId } = renderTestApp(<SignedInLayout />);

    expect(getByTestId('no-poa-permissions-alert')).to.exist;
  });

  it('renders content', () => {
    const { getByTestId } = renderTestApp(<SignedInLayout />, {
      initAction: {
        type: FETCH_TOGGLE_VALUES_SUCCEEDED,
        payload: {},
      },
    });

    expect(getByTestId('signed-in-layout-content')).to.exist;
  });

  describe('NoPOAPermissionsAlert', () => {
    it('renders alert', () => {
      const { getByTestId } = render(<NoPOAPermissionsAlert />);
      expect(getByTestId('no-poa-permissions-alert')).to.exist;
    });

    it('renders heading', () => {
      const { getByTestId } = render(<NoPOAPermissionsAlert />);
      expect(getByTestId('no-poa-permissions-alert-heading').textContent).to.eq(
        'You do not have permission to manage power of attorney requests',
      );
    });

    it('renders description', () => {
      const { getByTestId } = render(<NoPOAPermissionsAlert />);
      expect(getByTestId('no-poa-permissions-alert-description')).to.exist;
    });
  });
});
