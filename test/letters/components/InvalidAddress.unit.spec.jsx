import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import InvalidAddress from '../../../src/js/letters/components/InvalidAddress';

describe('InvalidAddress', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<InvalidAddress/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
