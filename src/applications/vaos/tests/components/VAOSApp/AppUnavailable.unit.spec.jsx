import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import AppUnavailable from '../../../components/VAOSApp/AppUnavailable';

describe('VAOS <AppUnavailable>', () => {
  it('should render', () => {
    const tree = shallow(<AppUnavailable />);

    expect(
      tree
        .find('AlertBox')
        .dive()
        .text(),
    ).to.contain('isn’t available');
    tree.unmount();
  });
});
