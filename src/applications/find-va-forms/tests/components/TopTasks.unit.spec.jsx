import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import TopTasks from '../../components/TopTasks';

describe('Find VA Forms <TopTasks>', () => {
  it('should render', () => {
    const tree = shallow(<TopTasks />);

    expect(tree.find('h2').text()).to.contain('Top tasks');

    tree.unmount();
  });
});
