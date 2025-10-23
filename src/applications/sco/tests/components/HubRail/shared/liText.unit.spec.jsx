import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LiText from '../../../../components/HubRail/shared/liText';

describe('liText', () => {
  it('renders without crashing', () => {
    const tree = shallow(<LiText text="sample text" />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
