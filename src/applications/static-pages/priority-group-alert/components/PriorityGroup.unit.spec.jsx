import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import PriorityGroup from './PriorityGroup';

const initialProps = {
  effectiveDate: '2019-01-02T21:58:55.000-06:00',
  priorityGroup: 'Group 8G',
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
    const content = 'Your assigned priority group is 8G (as of 2019-01-02)';
    expect(wrapper.getByText(content)).to.exist;
  });

  it('links to an article about form 10-10EZR', () => {
    const wrapper = setup();
    expect(wrapper).to.exist;
    const link = wrapper.getByRole('link', { name: 'form 10-10EZR' });
    expect(link).to.exist;
    expect(link.href.endsWith('/health-care/update-health-information/')).to.be
      .true;
  });
});
