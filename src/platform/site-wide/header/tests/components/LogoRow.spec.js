import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { mockEventListeners } from 'platform/testing/unit/helpers';
import { LogoRow } from '../../components/LogoRow';

describe('<LogoRow>', () => {
  const props = {
    isMenuOpen: false,
    setIsMenuOpen: sinon.stub().resolves(true),
    updateExpandedMenuID: sinon.stub().resolves(true),
  };

  let oldWindow = null;
  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(
      global.window,
      mockEventListeners({
        location: { pathname: '/' },
      }),
    );
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should render', () => {
    const wrapper = shallow(<LogoRow {...props} />);
    expect(wrapper.find('.header-logo-row').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should render Menu Button', () => {
    const wrapper = shallow(<LogoRow {...props} />);
    expect(wrapper.find('.header-menu-button').exists()).to.be.true;
    wrapper.unmount();
  });

  it('should NOT render Menu Button on the Unified Sign in Page (USiP)', () => {
    global.window.location.pathname = '/sign-in';
    const wrapper = shallow(<LogoRow {...props} />);
    expect(wrapper.find('.header-menu-button').exists()).to.be.false;
    wrapper.unmount();
  });
});
