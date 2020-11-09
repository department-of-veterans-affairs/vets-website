import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { PersonalizationDropdown } from '../../components/PersonalizationDropdown';

describe('<PersonalizationDropdown>', () => {
  let oldWindow = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      dataLayer: [],
    });
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    expect(wrapper).to.exist;
    wrapper.unmount();
  });

  it('should report analytics when clicking My VA', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    wrapper
      .find('a')
      .at(0)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('my-va');
    wrapper.unmount();
  });

  it('should report analytics when clicking My Health', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    wrapper
      .find('a')
      .at(1)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('my-health');
    wrapper.unmount();
  });

  it('should report analytics when clicking Profile', () => {
    const wrapper = shallow(<PersonalizationDropdown />);
    wrapper
      .find('a')
      .at(2)
      .simulate('click');
    const recordedEvent = global.window.dataLayer[0];
    expect(recordedEvent.event).to.equal('nav-user');
    expect(recordedEvent['nav-user-section']).to.equal('profile');
    wrapper.unmount();
  });
});
