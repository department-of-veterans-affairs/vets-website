import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import CollapsiblePanel from '../../../src/js/common/components/CollapsiblePanel';

describe('<CollapsiblePanel>', () => {
  it('should render the correct panel header', () => {
    const tree = SkinDeep.shallowRender(
      <CollapsiblePanel
        panelName={'Test panel'}/>
    );

    expect(tree.subTree('.usa-button-unstyled').text()).to.contain('Test panel');
  });

  it('should handle toggling chapter', () => {
    const tree = SkinDeep.shallowRender(
      <CollapsiblePanel
        panelName={'Test panel'}/>
    );

    expect(tree.everySubTree('.usa-accordion-content')).to.be.empty;

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.usa-accordion-content')).not.to.be.empty;

    tree.getMountedInstance().toggleChapter();

    expect(tree.everySubTree('.usa-accordion-content')).to.be.empty;
  });
});
