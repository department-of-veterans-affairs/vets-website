import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { VAProfileApp } from '../../containers/VAProfileApp';

describe('<VAProfileApp/>', () => {
  let props = {};
  before(() => {
    props = {
      user: {},
      profile: {},
      downtimeData: {},
      uiActions: {},
      fetchActions: {},
      updateActions: {},
      updateFormFieldActions: {},
      downtimeActions: {}
    };
  });
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<VAProfileApp {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.be.ok;
  });
});
