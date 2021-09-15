import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AlertBox from '../../components/AlertBox';

describe('<AlertBox>', () => {
  it('should render', () => {
    const tree = shallow(<AlertBox />);
    expect(tree.type()).to.not.equal(null);
    tree.unmount();
  });
});
