import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Expander from '../../../components/appeals-v2/Expander';

describe('<Expander/>', () => {
  const defaultProps = {
    dateRange: 'June 5, 1985 - July 29, 2017',
    onToggle: () => {},
    cssClass: 'section-unexpanded',
    expanded: false,
    missingEvents: false,
  };

  it('should render as an <li/>', () => {
    const { container } = render(<Expander {...defaultProps} />);
    expect($('li', container)).to.exist;
  });

  it('should render a button that calls onToggle prop when clicked', () => {
    const toggleSpy = sinon.spy();
    const props = {
      ...defaultProps,
      onToggle: toggleSpy,
    };
    const wrapper = shallow(<Expander {...props} />);
    const toggleButton = wrapper.find('va-button');
    toggleButton.simulate('click');
    expect(toggleSpy.calledOnce).to.be.true;
    wrapper.unmount();
  });

  it('should render the correct expanded attributes', () => {
    const props = {
      ...defaultProps,
      expanded: true,
    };
    const { container } = render(<Expander {...props} />);
    expect($('va-button', container).getAttribute('text')).to.eq(
      'Hide past events',
    );
    expect($('.section-expanded', container)).to.exist;
  });

  it('should render the correct unexpanded attributes', () => {
    const { container } = render(<Expander {...defaultProps} />);
    expect($('va-button', container).getAttribute('text')).to.eq(
      'Reveal past events',
    );
    expect($('.section-unexpanded', container)).to.exist;
  });

  it('should render the missing events alert', () => {
    const props = {
      ...defaultProps,
      missingEvents: true,
      expanded: true,
    };
    const { container } = render(<Expander {...props} />);
    expect($('.usa-alert', container)).to.exist;
  });

  it('should not render the missing events alert when there are no missing events', () => {
    const props = {
      ...defaultProps,
      expanded: true,
    };
    const { container } = render(<Expander {...props} />);
    expect($('.usa-alert', container)).not.to.exist;
  });
});
