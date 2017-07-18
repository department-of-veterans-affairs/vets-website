import React from 'react';
import { findDOMNode } from 'react-dom';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import StatusPage from '../../../src/js/post-911-gib-status/containers/StatusPage.jsx';

import reducer from '../../../src/js/post-911-gib-status/reducers/index.js';
import createCommonStore from '../../../src/js/common/store';

const store = createCommonStore(reducer);

describe('<StatusPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<StatusPage store={store}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('should show title and print button', () => {
    const node = findDOMNode(ReactTestUtils.renderIntoDocument(<StatusPage store={store}/>));
    expect(node.querySelector('.schemaform-title').textContent)
      .to.contain('Post-9/11 GI Bill Benefit Information');
    expect(node.querySelector('.usa-button-primary').textContent)
      .to.contain('Print Benefit Information');
  });
});

