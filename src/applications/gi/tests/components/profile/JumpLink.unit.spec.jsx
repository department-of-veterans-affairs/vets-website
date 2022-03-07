import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import JumpLink from 'platform/site-wide/jump-link/JumpLink';

describe('<JumpLink>', () => {
  it('should render', () => {
    const tree = shallow(<JumpLink />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
