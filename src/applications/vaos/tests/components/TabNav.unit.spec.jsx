import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import TabNav from '../../components/TabNav';

describe('<TabNav>', () => {
  it('should render two tabs', () => {
    const tree = shallow(<TabNav id={1} />);

    expect(tree.find('.vaos-appts__tabs').props().children.length).to.equal(2);
    expect(
      tree.find('.vaos-appts__tabs').props().children[0].props.shortcut,
    ).to.equal(1);
    tree.unmount();
  });
});
