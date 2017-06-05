import React from 'react';
// import ReactTestUtils from 'react-dom/test-utils';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { createStore } from 'redux';

import ConfirmAddress from '../../../src/js/va-letters/containers/ConfirmAddress';
import reducer from '../../../src/js/common/reducers';

const store = createStore(reducer);

const props = {
  isAddressConfirmed: null,
  store,

  onAddressConfirmation: () => {},
  dispatch: () => {},
  router: () => {}
};

describe('<ConfirmAddress>', () => {
  it.only('has sane looking features', () => {
    const tree = SkinDeep.shallowRender(<ConfirmAddress {...props}/>);

    // const buttons = tree.everySubTree('button');
    // expect(buttons).to.have.lengthOf(2);

    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
