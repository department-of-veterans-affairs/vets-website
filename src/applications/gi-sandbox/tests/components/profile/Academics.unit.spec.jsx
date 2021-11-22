import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Academics from '../../../components/profile/Academics';

describe('<Academics>', () => {
  it('should render', () => {
    const tree = shallow(<Academics institution={{}} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
