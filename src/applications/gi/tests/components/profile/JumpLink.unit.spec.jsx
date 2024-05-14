import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import JumpLink from '../../../components/profile/JumpLink';

describe('<JumpLink>', () => {
  it('should render', () => {
    const tree = shallow(<JumpLink />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
  it('should render the JumpLink component with a link and call jumpLinkClicked and recordEvent when clicked', () => {
    const jumpToId = 'targetId';
    const label = 'Jump Link Label';
    const iconToggle = true;

    const jumpLinkClicked = sinon.spy();
    const recordEvent = sinon.spy();

    const wrapper = mount(
      <JumpLink label={label} jumpToId={jumpToId} iconToggle={iconToggle} />,
    );

    wrapper
      .find('a.jump-link')
      .simulate('click', { preventDefault: jumpLinkClicked });

    expect(wrapper.find('a.jump-link')).to.have.lengthOf(1);
    expect(jumpLinkClicked.calledOnce).to.be.true;
    expect(recordEvent.calledOnce).to.be.false;
    wrapper.unmount();
  });
  it('it should show jumplink link', () => {
    global.window.buildType = true;
    const label = 'Jump Link Label';
    const iconToggle = true;
    const jumpToId = 'targetId';

    const wrapper = mount(
      <JumpLink label={label} jumpToId={jumpToId} iconToggle={iconToggle} />,
    );
    expect(wrapper.find('a.jump-link.arrow-down-link')).to.exist;
    wrapper.unmount();
  });
});
