import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import EFoldersApp from '../containers/EFoldersApp';

describe('EFoldersApp', () => {
  it('mounts container', () => {
    const wrapper = shallow(<EFoldersApp />);
    expect(wrapper.length).to.equal(1);
    wrapper.unmount();
  });
});
