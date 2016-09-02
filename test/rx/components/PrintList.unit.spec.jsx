import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import PrintList from '../../../src/js/rx/components/PrintList.jsx';

describe('<PrintList>', () => {
  it('should have one option by default', () => {
    const tree = SkinDeep.shallowRender(
      <PrintList type="default"/>
    );
    expect(tree.everySubTree('.rx-print-list-option').length).to.equal(0);
  });
  it('should have three options if it\'s on the "history" page', () => {
    const tree = SkinDeep.shallowRender(
      <PrintList type="history"/>
    );
    expect(tree.everySubTree('.rx-print-list-option').length).to.equal(3);
  });
});
