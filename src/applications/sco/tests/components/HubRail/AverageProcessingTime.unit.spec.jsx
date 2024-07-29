import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AverageProcessingTime from '../../../components/HubRail/AverageProcessingTime';

describe('AverageProcessingTime', () => {
  it('renders without crashing', () => {
    const tree = shallow(<AverageProcessingTime />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
