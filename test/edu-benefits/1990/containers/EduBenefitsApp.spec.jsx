import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import EduBenefitsApp from '../../../../src/js/edu-benefits/1990/containers/EduBenefitsApp';
import reducer from '../../../../src/js/edu-benefits/1990/reducers';

const store = createStore(reducer);

describe('<EduBenefitsApp>', () => {
  it('Sanity check the component renders', () => {
    const mockRoutes = [{ path: '/fake' }];
    const tree = SkinDeep.shallowRender(<EduBenefitsApp store={store} location={{ pathname: '/blah' }} route={{ childRoutes: mockRoutes }}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
