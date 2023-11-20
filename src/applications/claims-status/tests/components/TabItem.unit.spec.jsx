import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { TabItem } from '../../components/TabItem';

const location = {
  pathname: '/appeals/1234567/status',
};

describe('<TabItem>', () => {
  it('should render tab', () => {
    const tree = SkinDeep.shallowRender(
      <TabItem
        shortcut={1}
        title="Title"
        location={location}
        tabpath="appeals/1234567/status"
      />,
    );

    expect(tree.subTree('IndexLink').props['aria-current']).to.equal('page');
    expect(tree.subTree('IndexLink').props.to).to.equal(
      'appeals/1234567/status',
    );
  });

  it('should use id if present', () => {
    const tree = SkinDeep.shallowRender(
      <TabItem
        shortcut={1}
        id="TitleHere"
        title="Title Here"
        location={location}
        tabpath="appeals/1234567/status"
      />,
    );

    expect(tree.subTree('IndexLink').props['aria-current']).to.equal('page');
    expect(tree.subTree('IndexLink').props.id).to.equal('tabTitleHere');
    expect(tree.subTree('IndexLink').props.to).to.equal(
      'appeals/1234567/status',
    );
  });
});
