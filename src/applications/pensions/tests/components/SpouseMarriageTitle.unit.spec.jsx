import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SpouseMarriageTitle from '../../components/SpouseMarriageTitle';

describe('Pensions SpouseMarriageTitle', () => {
  it('should render first marriage title', () => {
    const tree = SkinDeep.shallowRender(
      <SpouseMarriageTitle id="id" formContext={{ pagePerItemIndex: 0 }} />,
    );

    expect(tree.text()).to.contain('Spouse’s first marriage');
  });
  it('should render eleventh marriage title', () => {
    const tree = SkinDeep.shallowRender(
      <SpouseMarriageTitle id="id" formContext={{ pagePerItemIndex: 10 }} />,
    );

    expect(tree.text()).to.contain('Spouse’s eleventh marriage');
  });
  it('should render 50th marriage title', () => {
    const tree = SkinDeep.shallowRender(
      <SpouseMarriageTitle id="id" formContext={{ pagePerItemIndex: 49 }} />,
    );

    expect(tree.text()).to.contain('Spouse’s 50th marriage');
  });
});
