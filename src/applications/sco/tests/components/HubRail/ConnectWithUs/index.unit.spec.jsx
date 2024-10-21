import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ConnectWithUs from '../../../../components/HubRail/ConnectWithUs/index';

describe('ConnectWithUs', () => {
  it('renders without crashing', () => {
    const tree = shallow(<ConnectWithUs />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
