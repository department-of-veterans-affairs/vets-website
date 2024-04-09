import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SignedInViewLayout from '../../containers/SignedInViewLayout';

describe('SignedInViewLayout', () => {
  const getSignedInViewLayout = poaPermissions =>
    render(<SignedInViewLayout poaPermissions={poaPermissions} />);

  it('renders alert when no POA Permissions', () => {
    const { getByTestId } = getSignedInViewLayout(false);
    expect(getByTestId('signed-in-view-layout-permissions-alert')).to.exist;
  });

  it('renders SideNav', () => {
    const { getByTestId } = getSignedInViewLayout();
    expect(getByTestId('sidenav-heading')).to.exist;
  });

  it('renders Breadcrumbs', () => {
    const { getByTestId } = getSignedInViewLayout();
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
