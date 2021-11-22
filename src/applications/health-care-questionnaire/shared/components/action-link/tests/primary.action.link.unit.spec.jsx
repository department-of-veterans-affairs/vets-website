import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { PrimaryActionLink } from '../index';

describe('health care questionnaire - get help footer  -', () => {
  it('uses the primary class', () => {
    const children = 'Hello, There';
    const wrapper = mount(<PrimaryActionLink>{children}</PrimaryActionLink>);
    expect(wrapper.find('a').exists()).to.be.true;
    expect(wrapper.find('a.vads-c-action-link--green').text()).to.contains(
      children,
    );

    wrapper.unmount();
  });
  it('displays test id', () => {
    const children = 'Hello, There';
    const testId = 'testing-1-2-3';
    const wrapper = mount(
      <PrimaryActionLink testId={testId}>{children}</PrimaryActionLink>,
    );
    expect(wrapper.html()).to.contain('data-testid="testing-1-2-3"');
    wrapper.unmount();
  });
  it('displays aria-label id', () => {
    const children = 'Hello, There';
    const label = 'testing-1-2-3';
    const wrapper = mount(
      <PrimaryActionLink ariaLabel={label}>{children}</PrimaryActionLink>,
    );
    expect(
      wrapper.find('a.vads-c-action-link--green').prop('aria-label'),
    ).to.equal('testing-1-2-3');
    wrapper.unmount();
  });
  it('onClick is used', () => {
    const onClick = sinon.spy();
    const component = mount(<PrimaryActionLink onClick={onClick} />);
    expect(component.exists('a.vads-c-action-link--green')).to.be.true;
    component
      .find('a.vads-c-action-link--green')
      .at(0)
      .simulate('click');
    expect(onClick.called).to.be.true;
    component.unmount();
  });
});
