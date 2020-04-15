import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import CautionFlagDetails from '../../components/profile/CautionFlagDetails';

describe('<CautionFlagDetails>', () => {
  it('does not render without caution flags', () => {
    const wrapper = shallow(<CautionFlagDetails cautionFlags={[]} />);
    expect(wrapper.html()).to.be.null;
    wrapper.unmount();
  });

  it('displays correct amount of flags', () => {
    const cautionFlags = [
      { title: 'Test flag a', id: 1 },
      { title: 'Test flag b', id: 2 },
    ];

    const wrapper = mount(<CautionFlagDetails cautionFlags={cautionFlags} />);
    expect(wrapper.find('div.flagDetail').length).to.equal(cautionFlags.length);
    wrapper.unmount();
  });

  it('sorts caution flags by title', () => {
    const cautionFlags = [
      { title: 'Test flag z', id: 1 },
      { title: 'Test flag a', id: 2 },
    ];

    const wrapper = mount(<CautionFlagDetails cautionFlags={cautionFlags} />);
    expect(
      wrapper
        .find('.usa-alert-heading')
        .at(0)
        .text(),
    ).to.equal(cautionFlags[1].title);
    wrapper.unmount();
  });

  it('displays caution flag data correctly', () => {
    const cautionFlag = {
      id: 1,
      title: 'Test flag',
      description: 'description',
      linkText: 'LINK',
      linkUrl: 'https://va.gov',
    };

    const wrapper = mount(<CautionFlagDetails cautionFlags={[cautionFlag]} />);
    const html = wrapper.html();
    expect(wrapper.find('a').length).to.equal(1);
    expect(html).to.contain(cautionFlag.title);
    expect(html).to.contain(cautionFlag.description);
    expect(html).to.contain(cautionFlag.linkText);
    expect(html).to.contain(cautionFlag.linkUrl);
    wrapper.unmount();
  });

  it('does not display link without link text and url', () => {
    const cautionFlags = [
      {
        title: 'Test flag a',
        id: 1,
      },
    ];

    const wrapper = mount(<CautionFlagDetails cautionFlags={cautionFlags} />);
    expect(wrapper.find('a').length).to.equal(0);
    wrapper.unmount();
  });

  it('displays link text without url as text', () => {
    const cautionFlag = {
      title: 'Test flag a',
      linkText: 'LINK',
      id: 1,
    };

    const wrapper = mount(<CautionFlagDetails cautionFlags={[cautionFlag]} />);
    expect(wrapper.find('a').length).to.equal(0);
    expect(wrapper.html()).to.contain(cautionFlag.linkText);
    wrapper.unmount();
  });
});
