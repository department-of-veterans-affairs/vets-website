import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import JumpLink from '../../../components/profile/JumpLink';

describe('<JumpLink>', () => {
  it('should render', () => {
    const tree = shallow(<JumpLink />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
