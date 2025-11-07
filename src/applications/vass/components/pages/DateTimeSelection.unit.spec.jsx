import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import DateTimeSelection from './DateTimeSelection';

describe('VASS Component: DateTimeSelection', () => {
  it('should render page title', () => {
    const screen = render(<DateTimeSelection />);

    expect(screen.getByTestId('header')).to.exist;
  });
});
