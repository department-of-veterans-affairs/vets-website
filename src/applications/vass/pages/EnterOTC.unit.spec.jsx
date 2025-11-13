import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import EnterOTC from './EnterOTC';

describe('VASS Component: EnterOTC', () => {
  it('should render page title', () => {
    const screen = render(<EnterOTC />);

    expect(screen.getByTestId('header')).to.exist;
  });
});
