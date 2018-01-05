import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';

import AuthApplicationSection from '../../../src/js/user-profile/components/AuthApplicationSection.jsx';

describe('<AuthApplicationSection>', () => {
  const props = {
    userProfile: {
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'rx',
        'messaging',
        'health-records',
        'evss-claims',
        'user-profile',
        'appeals-status',
        'form-save-in-progress',
        'form-prefill',
        'id-card'
      ]
    },
  };
  let windowOpen;
  let oldWindow;
  const setup = () => {
    oldWindow = global.window;
    windowOpen = sinon.stub().returns({ focus: f => f });
    global.window = {
      open: windowOpen,
      dataLayer: []
    };
  };
  const takeDown = () => {
    global.window = oldWindow;
  };
  before(setup);
  after(takeDown);

  it('should render', () => {
    const tree = SkinDeep.shallowRender(<AuthApplicationSection {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should display verify link if there are no available services', () => {
    const tree = SkinDeep.shallowRender(<AuthApplicationSection userProfile={{ services: [] }}/>);
    expect(tree.everySubTree('span').length).to.equal(1);
  });

  it('should display available services as well as verify link if there are some unavailable services', () => {
    const tree = SkinDeep.shallowRender(<AuthApplicationSection userProfile={{
      services: [
        'facilities',
        'hca',
        'edu-benefits',
        'user-profile',
      ]
    }}/>);
    expect(tree.everySubTree('span').length).to.equal(2);
  });

  it('should not display verify link if all services are available', () => {
    const tree = SkinDeep.shallowRender(<AuthApplicationSection {...props}/>);
    expect(tree.everySubTree('span').length).to.equal(1);
  });
});
