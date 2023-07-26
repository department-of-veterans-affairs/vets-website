import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import PriorityGroup from '../../components/PriorityGroup';

const initialProps = {
  value: 'Group 8G',
};

const setup = (props = {}) =>
  render(<PriorityGroup {...initialProps} {...props} />);

describe('Priority Group Component', () => {
  it('renders', () => {
    const wrapper = setup();
    expect(wrapper).to.exist;
  });

  it('displays the assigned priority group', () => {
    const wrapper = setup();
    const content = 'Your healthcare priority group: 8G';
    expect(wrapper.getByText(content)).to.exist;
  });

  it('links to an article about VA Priority Groups', () => {
    const wrapper = setup();
    const name = 'Learn more about priority groups';
    const link = wrapper.getByRole('link', { name });
    expect(link).to.exist;
    expect(link.href.endsWith('/health-care/eligibility/priority-groups')).to.be
      .true;
  });
});
