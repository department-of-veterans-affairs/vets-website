import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import ResourcesForSchoolTitle from '../../components/ResourcesForSchoolTitle';

describe('ResourcesForSchoolTitle', () => {
  it('renders without crashing', () => {
    const tree = shallow(<ResourcesForSchoolTitle />);
    expect(tree.exists()).to.be.true;
    tree.unmount();
  });
});
