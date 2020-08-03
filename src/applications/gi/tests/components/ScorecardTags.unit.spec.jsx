import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import ScorecardTags from '../../components/ScorecardTags';

const props = {
  profile: {
    attributes: {
      menonly: 1,
      womenonly: 0,
      relaffil: 23,
      hbcu: 1,
    },
  },
};

describe('<ScorecardTags>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ScorecardTags styling="info-flag " it={props} />,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });
});
