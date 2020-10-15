import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import App from '../containers/App';

describe('Financial Status Report Form', () => {
  it('mounts the container', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
});
