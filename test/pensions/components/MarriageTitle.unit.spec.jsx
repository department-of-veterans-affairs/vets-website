import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import MarriageTitle from '../../../src/js/pensions/components/MarriageTitle';

describe('Pensions MarriageTitle', () => {
  it('should render first marriage title', () => {
    const tree = SkinDeep.shallowRender(
      <MarriageTitle
          id="id"
          formContext={{ pagePerItemIndex: 0 }}/>
    );

    expect(tree.text()).to.contain('First marriage');
  });
  it('should render marriage title with number value', () => {
    const tree = SkinDeep.shallowRender(
      <MarriageTitle
          id="id"
          formContext={{ pagePerItemIndex: 10 }}/>
    );

    expect(tree.text()).to.contain('Marriage 11');
  });
});
