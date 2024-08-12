import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LastUpdated from '../../../components/MainContent/LastUpdated';

describe('LastUpdated', () => {
  it('renders without crashing', () => {
    const tree = shallow(<LastUpdated />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
