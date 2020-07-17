import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import CautionFlagHeading from '../../components/profile/CautionFlagHeading';
import sinon from 'sinon';

describe('<CautionFlagHeading>', () => {
  it('renders', () => {
    const wrapper = shallow(<CautionFlagHeading />);
    expect(wrapper.html()).to.not.be.undefined;
    wrapper.unmount();
  });

  it('does not display if flags do not exist', () => {
    const wrapper = shallow(<CautionFlagHeading cautionFlags={[]} />);
    expect(wrapper.find('a').length).to.equal(0);
    wrapper.unmount();
  });

  it('displays if flags exist', () => {
    const wrapper = mount(
      <CautionFlagHeading cautionFlags={[{ title: 'Test flag', id: 1 }]} />,
    );
    expect(wrapper.find('a').length).to.equal(1);
    wrapper.unmount();
  });

  it('displays correct message for one flag', () => {
    const wrapper = shallow(
      <CautionFlagHeading
        cautionFlags={[{ title: 'Test flag a', id: 1 }]}
        onViewWarnings={() => {}}
      />,
    );
    expect(wrapper.html()).to.contain('This school has a cautionary warning');
    wrapper.unmount();
  });

  it('displays correct message for multiple flags', () => {
    const wrapper = shallow(
      <CautionFlagHeading
        cautionFlags={[
          { title: 'Test flag a', id: 1 },
          { title: 'Test flag b', id: 2 },
        ]}
        onViewWarnings={() => {}}
      />,
    );
    expect(wrapper.html()).to.contain('This school has cautionary warnings');
    wrapper.unmount();
  });

  it('displays correct amount of flags', () => {
    const cautionFlags = [
      { title: 'Test flag a', id: 1 },
      { title: 'Test flag b', id: 2 },
    ];

    const wrapper = mount(
      <CautionFlagHeading
        cautionFlags={cautionFlags}
        onViewWarnings={() => {}}
      />,
    );
    expect(wrapper.find('li.headingFlag').length).to.equal(cautionFlags.length);
    wrapper.unmount();
  });

  it('sorts caution flags by title', () => {
    const cautionFlags = [
      { title: 'Test flag z', id: 1 },
      { title: 'Test flag a', id: 2 },
    ];

    const wrapper = mount(
      <CautionFlagHeading
        cautionFlags={cautionFlags}
        onViewWarnings={() => {}}
      />,
    );
    expect(
      wrapper
        .find('li.headingFlag')
        .at(0)
        .text(),
    ).to.equal(cautionFlags[1].title);
    wrapper.unmount();
  });

  it('calls onViewWarnings onClick', () => {
    const onViewWarnings = sinon.spy();

    const wrapper = mount(
      <CautionFlagHeading
        cautionFlags={[{ title: 'Test flag', id: 1 }]}
        onViewWarnings={onViewWarnings}
      />,
    );

    wrapper
      .find('a')
      .at(0)
      .simulate('click');

    expect(onViewWarnings.called).to.be.true;

    wrapper.unmount();
  });

  it('tracks onViewWarnings click', () => {
    const wrapper = mount(
      <CautionFlagHeading
        cautionFlags={[{ title: 'Test flag', id: 1 }]}
        onViewWarnings={() => {}}
      />,
    );

    wrapper
      .find('a')
      .at(0)
      .simulate('click');

    expect(global.window.dataLayer[0].alertBoxHeading).to.eq(
      'Jumplink - This school has a cautionary warning',
    );

    wrapper.unmount();
  });
});
