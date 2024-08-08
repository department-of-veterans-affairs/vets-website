import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import CrisisLineConnectButton from '../../components/CrisisLineConnectButton';

describe('Crisis Line Connect Button', () => {
  it('renders without errors', async () => {
    render(<CrisisLineConnectButton />);

    expect(
      document.querySelector('[text="Connect with the Veterans Crisis Line"]'),
    ).to.exist;

    expect(document.querySelector('[secondary="true"]')).to.exist;
  });
});
