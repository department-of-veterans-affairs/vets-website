import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import createCommonStore from 'platform/startup/store';
import { GiBillApp } from 'applications/gi/containers/GiBillApp';
import reducer from '../../reducers';

const defaultProps = createCommonStore(reducer).getState();
const location = {
  pathname: '/',
  search: '',
  hash: '',
  action: 'POP',
  key: null,
  basename: '/gi-bill-comparison-tool',
  query: {},
};
const params = {
  facilityCode: '00000000',
};

describe('<GiBillApp>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <GiBillApp {...defaultProps} location={location} params={params} />,
    );
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  it('should render LoadingIndicator', () => {
    const props = {
      ...defaultProps,
      constants: {
        ...defaultProps.constants,
        inProgress: true,
      },
    };
    const tree = SkinDeep.shallowRender(
      <GiBillApp {...props} location={location} params={params} />,
    );
    expect(tree.subTree('LoadingIndicator')).to.be.ok;
  });

  it('should render error message when constants fail', () => {
    const errorProps = {
      ...defaultProps,
      constants: {
        ...defaultProps.constants,
        inProgress: true,
        error: 'Service Unavailable',
      },
    };
    const tree = SkinDeep.shallowRender(
      <GiBillApp {...errorProps} location={location} params={params} />,
    );
    expect(tree.subTree('ServiceError')).to.be.ok;
  });
});
