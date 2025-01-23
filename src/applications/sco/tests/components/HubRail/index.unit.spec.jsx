import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import HubRail from '../../../components/HubRail/index';

describe('HubRail', () => {
  it('renders without crashing', () => {
    const tree = shallow(<HubRail />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
