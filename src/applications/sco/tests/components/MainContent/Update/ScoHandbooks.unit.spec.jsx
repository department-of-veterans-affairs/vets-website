import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ScoHandbooks from '../../../../components/MainContent/Update/ScoHandbooks';

describe('ScoHandbooks', () => {
  it('renders without crashing', () => {
    const tree = shallow(<ScoHandbooks />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
