import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import Verify from './Verify';

describe('VASS Component: Verify', () => {
  it('should render page title', () => {
    const screen = render(<Verify />);

    expect(screen.getByTestId('header')).to.exist;
  });
});
