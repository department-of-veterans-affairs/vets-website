import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import { wrapWithRouterContext } from '../../util/unit-helpers';

import { Main } from '../../../src/js/blue-button/containers/Main';

const props = {};

describe('<Main>', () => {
  const tree = SkinDeep.shallowRender(
    wrapWithRouterContext(<Main {...props}/>)
  );

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
