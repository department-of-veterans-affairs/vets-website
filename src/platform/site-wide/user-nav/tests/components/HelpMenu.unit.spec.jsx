import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HelpMenu from '../../components/HelpMenu.jsx';

describe('<HelpMenu>', () => {
  const props = {
    isOpen: false,
    clickHandler: f => f,
  };

  let oldWindow = null;

  beforeEach(() => {
    oldWindow = global.window;
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      location: {
        hostname: 'www.va.gov',
        replace: () => {},
        pathname: '/',
      },
    });
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  it('should hide the help menu contents', () => {
    const wrapper = shallow(<HelpMenu {...props} />);
    expect(wrapper.find('#help-menu').prop('isOpen')).to.be.false;
    wrapper.unmount();
  });

  it('should show the help menu contents', () => {
    const wrapper = shallow(<HelpMenu {...props} isOpen />);
    expect(wrapper.find('.va-helpmenu-contents')).to.exist;
    wrapper.unmount();
  });
});
