import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Checkbox from '../../components/Checkbox';

describe('<Checkbox>', () => {
  it('should render', () => {
    const tree = shallow(<Checkbox />);
    expect(tree.type()).to.not.equal(null);
    expect(tree.find('input').length).to.eq(1);
    tree.unmount();
  });
});
