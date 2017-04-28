import { createStore } from 'redux';
import { expect } from 'chai';
import React from 'react';
import sinon from 'sinon';
import SkinDeep from 'skin-deep';

import { LandingPage } from '../../../src/js/gi/containers/LandingPage';
import reducer from '../../../src/js/gi/reducers';

const defaultProps = createStore(reducer);

describe('<LandingPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<LandingPage {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should handleSubmit correctly', () => {
    const props = {
      defaultProps,
      router: { push: sinon.spy() },
      location: { query: {} }
    };

    const tree = SkinDeep.shallowRender(<LandingPage {...props}/>);
    tree.getMountedInstance().handleSubmit({ preventDefault: () => {} });
    expect(props.router.push.called).to.be.true;
  });
});
