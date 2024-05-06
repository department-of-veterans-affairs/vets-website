import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import SignedInViewLayout from '../../containers/SignedInViewLayout';

describe('SignedInViewLayout', () => {
  const getSignedInViewLayout = poaPermissions =>
    render(<SignedInViewLayout poaPermissions={poaPermissions} />);

  it('renders error when no POA Permissions', () => {
    const { getByTestId } = getSignedInViewLayout(null);
    expect(getByTestId('poa-permissions-error')).to.exist;
  });

  it('renders content when has POA Permissions', () => {
    const { getByTestId } = getSignedInViewLayout(true);
    expect(getByTestId('signed-in-view-layout-content')).to.exist;
  });
});
