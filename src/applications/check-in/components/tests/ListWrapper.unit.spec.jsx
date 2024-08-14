/* eslint-disable camelcase */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import ListWrapper from '../ListWrapper';

describe('ListWrapper', () => {
  it('Renders as a list when there is more than one item', () => {
    const screen = render(<ListWrapper count={2} testId="test-wrapper" />);
    expect(screen.getByTestId('test-wrapper')).to.exist;
    expect(screen.getByRole('list')).to.exist;
  });
  it('Renders without a list when there is one item', () => {
    const screen = render(<ListWrapper count={1} testId="test-wrapper" />);
    expect(screen.getByTestId('test-wrapper')).to.exist;
    expect(screen.queryByRole('list')).to.not.exist;
  });
});
