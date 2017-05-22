import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import createCommonStore from '../../../src/js/common/store';
import { ProfilePage } from '../../../src/js/gi/containers/ProfilePage';
import reducer from '../../../src/js/gi/reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<ProfilePage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ProfilePage {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should show LoadingState when profile is fetching', () => {
    const inProgressProps = {
      ...defaultProps,
      profile: { inProgress: true }
    };
    const tree = SkinDeep.shallowRender(<ProfilePage {...inProgressProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });
});
