import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import BackToTop from '../../components/BackToTop';

describe('<BackToTop>', () => {
  it('should render', () => {
    const tree = shallow(<BackToTop compare={{ open: true }} />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
