import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import SpouseMarriageTitle from '../../../components/SpouseMarriageTitle';

describe('Pensions SpouseMarriageTitle', () => {
  it('should render single marriage title', () => {
    const tree = SkinDeep.shallowRender(
      <SpouseMarriageTitle id="id" formData={{ spouseMarriages: [{}] }} />,
    );

    expect(tree.text()).to.contain('Spouse’s former marriage');
  });
  it('should render multi-marriage title', () => {
    const tree = SkinDeep.shallowRender(
      <SpouseMarriageTitle id="id" formData={{ spouseMarriages: [{}, {}] }} />,
    );

    expect(tree.text()).to.contain('Spouse’s former marriages');
  });
});
