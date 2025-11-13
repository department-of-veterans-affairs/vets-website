import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import Review from './Review';

describe('VASS Component: Review', () => {
  it('should render page title', () => {
    const screen = render(<Review />);

    expect(screen.getByTestId('header')).to.exist;
  });
});
