import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CommunityCareInstructions from '../../components/CommunityCareInstructions';

describe('VAOS <CommunityCareInstructions>', () => {
  it('should return instructions', () => {
    const tree = shallow(<CommunityCareInstructions instructions="Testing" />);
    expect(tree.text()).to.contain('Special instructions');
    expect(tree.text()).to.contain('Testing');

    tree.unmount();
  });

  it('should not return instructions if empty', () => {
    const tree = shallow(<CommunityCareInstructions instructions="" />);
    expect(tree.text()).to.be.empty;
    tree.unmount();
  });
});
