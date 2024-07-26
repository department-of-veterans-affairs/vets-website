import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import FollowUs from '../../../../components/HubRail/ConnectWithUs/followUs';

describe('FollowUs', () => {
  it('renders without crashing', () => {
    const tree = shallow(<FollowUs />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
