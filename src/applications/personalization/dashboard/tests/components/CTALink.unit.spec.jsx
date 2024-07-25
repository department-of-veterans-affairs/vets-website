import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import CTALink from '../../components/CTALink';

describe('<CTALink />', () => {
  it('should render', () => {
    const linkText = 'Testing link';
    const tree = render(
      <CTALink testId="12345" href="https://example.com" text={linkText} />,
    );

    expect(tree.getByTestId('12345')).to.not.be.null;
    expect(tree.getByText(linkText)).to.not.be.null;
    expect(tree.container.querySelector('i.fa-chevron-right')).to.be.null;
    tree.unmount();
  });

  it('should render the correct href', () => {
    const wrapper = shallow(
      <CTALink testId="12345" href="https://example.com" text="Testing link" />,
    );

    expect(wrapper.prop('href')).to.eq('https://example.com');
    wrapper.unmount();
  });

  it('should show the arrow', () => {
    const tree = render(
      <CTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        showArrow
      />,
    );

    expect(tree.container.querySelector('va-icon')).to.not.be.null;
    tree.unmount();
  });

  it('should open in a new tab', () => {
    const wrapper = shallow(
      <CTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        newTab
      />,
    );

    expect(wrapper.prop('target')).to.eq('_blank');
    expect(wrapper.prop('rel')).to.eq('noreferrer noopener');
    wrapper.unmount();
  });

  it('should render the aria-label', () => {
    const wrapper = shallow(
      <CTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        ariaLabel="test label"
      />,
    );

    expect(wrapper.prop('aria-label')).to.eq('test label');
    wrapper.unmount();
  });

  it('should render with the given class names', () => {
    const wrapper = shallow(
      <CTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        className="testing"
      />,
    );

    expect(wrapper.prop('className')).to.eq(
      'vads-u-display--inline-block testing',
    );
    wrapper.unmount();
  });

  it('should handle an onClick prop', () => {
    const onClickSpy = sinon.spy();
    const tree = render(
      <CTALink
        testId="12345"
        href="https://example.com"
        text="Testing link"
        onClick={onClickSpy}
      />,
    );

    tree.container.querySelector('a').click();
    expect(onClickSpy.called).to.be.true;
    tree.unmount();
  });
});
