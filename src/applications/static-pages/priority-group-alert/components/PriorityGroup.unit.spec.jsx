import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import PriorityGroup from './PriorityGroup';

const defaultProps = {
  updatedAt: '2023/07/13',
  value: '8G',
};

const setup = (props = {}) =>
  render(<PriorityGroup {...defaultProps} {...props} />);

describe('Priority Group Component', () => {
  it('renders', () => {
    const wrapper = setup();
    expect(wrapper).to.exist;
  });
});
