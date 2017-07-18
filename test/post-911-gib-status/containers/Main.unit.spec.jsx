import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Main } from '../../../src/js/post-911-gib-status/containers/Main';

const defaultProps = {
  availability: 'available',
  enrollmentData: { }
};

describe('Main', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Main {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should show data when service is available', () => {
  });

  it('should show backend service error', () => {
  });

  it('should show backend authentication error', () => {
  });

  it('should show no records available', () => {
  });

  it('should show system down message when service is unavailable', () => {
  });
});
