import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { PriorityGroup } from '../../containers/PriorityGroup';

const initialProps = {
  enabled: true,
  fetchEnrollmentStatus: () => {},
  value: 'Group 8G',
};

const setup = (props = {}) =>
  render(<PriorityGroup {...initialProps} {...props} />);

describe('Priority Group Component', () => {
  it('renders', () => {
    const { container } = setup();
    expect(container).to.not.be.empty;
  });

  it('does not render when disabled', () => {
    const { container } = setup({ enabled: false });
    expect(container).to.be.empty;
  });

  it('does not render when value is null', () => {
    const { container } = setup({ value: null });
    expect(container).to.be.empty;
  });

  it('displays the assigned priority group', () => {
    const { getByTestId } = setup();
    const content = 'Your health care priority group: 8G';
    expect(getByTestId('mhv-priority-group').textContent).to.contain(content);
  });

  it('links to an article about priority groups, tracked by datadog', () => {
    const wrapper = setup();
    const name = 'priority group';
    const link = wrapper.getByRole('link', { name });
    expect(link).to.exist;
    const linkPath = '/health-care/eligibility/priority-groups';
    expect(link.href.endsWith(linkPath)).to.be.true;
    const ddActionName = link.getAttribute('data-dd-action-name');
    expect(ddActionName).to.eq('VA priority groups link');
  });
});
