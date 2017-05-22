import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import createCommonStore from '../../../src/js/common/store';

import { GiBillApp } from '../../../src/js/gi/containers/GiBillApp';
import reducer from '../../../src/js/gi/reducers';

const defaultProps = createCommonStore(reducer).getState();

describe('<GiBillApp>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<GiBillApp {...defaultProps}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should render LoadingIndicator', () => {
    const props = {
      ...defaultProps,
      constants: {
        ...defaultProps.constants,
        inProgress: true,
      }
    };
    const tree = SkinDeep.shallowRender(<GiBillApp {...props}/>);
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });
});
