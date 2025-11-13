import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import Confirmation from './Confirmation';

describe('VASS Component: Confirmation', () => {
  it('should render page title', () => {
    const screen = render(<Confirmation />);

    expect(screen.getByTestId('header')).to.exist;
  });
});
