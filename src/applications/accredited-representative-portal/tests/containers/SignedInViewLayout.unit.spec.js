import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SignedInViewLayout from '../../containers/SignedInViewLayout';

describe('SignedInView Layout', () => {
  it('renders Signed In View Layout', () => {
    render(<SignedInViewLayout />);
  });

  it('renders alert when no POA Permissions', () => {
    const { getByTestId } = render(
      <SignedInViewLayout poaPermissions={false} />,
    );
    expect(getByTestId('signed-in-view-permissions-alert')).to.exist;
  });

  it('renders SideNav', () => {
    const { getByTestId } = render(<SignedInViewLayout />);
    expect(getByTestId('sidenav-heading').textContent).to.equal('Navigation');
  });

  it('renders Breadcrumbs', () => {
    const { getByTestId } = render(<SignedInViewLayout />);
    expect(getByTestId('breadcrumbs')).to.exist;
  });
});
