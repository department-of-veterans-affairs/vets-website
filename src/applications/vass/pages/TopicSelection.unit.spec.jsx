import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import TopicSelection from './TopicSelection';

describe('VASS Component: TopicSelection', () => {
  it('should render page title', () => {
    const screen = render(<TopicSelection />);

    expect(screen.getByTestId('header')).to.exist;
  });
});
