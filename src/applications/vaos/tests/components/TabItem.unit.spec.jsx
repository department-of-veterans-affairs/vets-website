import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { TabItem } from '../../components/TabItem';

const location = {
  pathname: 'upcoming',
};

describe('<TabItem>', () => {
  it('should render tab', () => {
    const tree = shallow(
      <TabItem
        shortcut={1}
        title="Title"
        location={location}
        tabpath="upcoming"
      />,
    );

    expect(tree.find('IndexLink').props()['aria-controls']).to.equal(
      'tabTitle',
    );
    expect(tree.find('IndexLink').props().to).to.equal('upcoming');
    tree.unmount();
  });

  it('should use id if present', () => {
    const tree = shallow(
      <TabItem
        shortcut={1}
        id="TitleHere"
        title="Title Here"
        location={location}
        tabpath="upcoming"
      />,
    );

    expect(tree.find('IndexLink').props()['aria-controls']).to.equal(
      'tabTitleHere',
    );
    expect(tree.find('IndexLink').props().id).to.equal('tabTitleHere');
    expect(tree.find('IndexLink').props().to).to.equal('upcoming');
    tree.unmount();
  });
});
