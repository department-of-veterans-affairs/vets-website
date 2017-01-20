import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import TrackPackageLink from '../../../src/js/rx/components/TrackPackageLink';

describe('<TrackPackageLink>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<TrackPackageLink/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should have the expected className', () => {
    const tree = SkinDeep.shallowRender(<TrackPackageLink/>);

    expect(tree.props.className).to.equal('rx-track-package-link');
  });

  it('should show expected element when external link', () => {
    const tree = SkinDeep.shallowRender(<TrackPackageLink external/>);

    expect(tree.subTree('a').props.target).to.equal('_blank');
  });

  it('should show expected element when internal link', () => {
    const tree = SkinDeep.shallowRender(<TrackPackageLink/>);

    expect(tree.subTree('Link')).to.be.ok;
  });
});
