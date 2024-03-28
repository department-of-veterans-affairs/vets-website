import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SignedInViewLayout from '../../containers/SignedInViewLayout';

describe('SignedInViewLayout', () => {
  it('renders alert when no POA Permissions', () => {
    const { getByTestId } = render(
      <SignedInViewLayout poaPermissions={false} />,
    );
    expect(getByTestId('signed-in-view-layout-permissions-alert')).to.exist;
  });

  it('renders SideNav', () => {
    const { getByTestId } = render(<SignedInViewLayout />);
    expect(getByTestId('sidenav-heading')).to.exist;
  });

  it('renders Breadcrumbs', () => {
    const { getByTestId } = render(<SignedInViewLayout />);
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
