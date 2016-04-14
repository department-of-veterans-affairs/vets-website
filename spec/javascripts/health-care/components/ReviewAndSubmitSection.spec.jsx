import React from 'react';
import { createStore } from 'redux';
import SkinDeep from 'skin-deep';

import ReviewAndSubmitSection from '../../../../_health-care/_js/components/ReviewAndSubmitSection';
import reducer from '../../../../_health-care/_js/reducers';

const store = createStore(reducer);

// TODO(crew): Get this passing correctly using connect();
describe('<ReviewAndSubmitSection>', () => {
  xit('Sanity check the component renders', () => {
    const tree = SkinDeep.shallowRender(<ReviewAndSubmitSection store={store}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.have.property('type', 'div');
  });
});

