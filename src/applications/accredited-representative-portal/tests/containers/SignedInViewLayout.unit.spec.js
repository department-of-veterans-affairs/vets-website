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
});
