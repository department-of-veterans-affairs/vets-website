import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import GetGovDeliveryUpdates from '../../../../components/HubRail/ConnectWithUs/getGovDeliveryUpdates';

describe('GetGovDeliveryUpdates', () => {
  it('renders without crashing', () => {
    const tree = shallow(<GetGovDeliveryUpdates />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
