import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LoginNote from 'platform/user/authentication/components/LoginNote';

describe('LoginNote', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LoginNote />);
  });
  afterEach(() => wrapper.unmount());

  it('should render', () => {
    expect(wrapper.find('a').text()).includes('Learn about creating');
    wrapper.unmount();
  });
});
