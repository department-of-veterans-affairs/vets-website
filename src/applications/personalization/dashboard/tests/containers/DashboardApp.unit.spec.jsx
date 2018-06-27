import React from 'react';
import SkinDeep from 'skin-deep';
import sinon from 'sinon';
import { expect } from 'chai';

import localStorage from '../../../../../platform/utilities/storage/localStorage';
import { DashboardApp } from '../../containers/DashboardApp';

const props = {
  profile: {
    loa: {}
  }
};

describe('<DashboardApp>', () => {
  before(() => {
    sinon.stub(localStorage, 'getItem');
  });

  after(() => {
    localStorage.getItem.restore();
  });

  it('should render', () => {
    const tree = SkinDeep.shallowRender(<DashboardApp {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.be.ok;
  });
});
