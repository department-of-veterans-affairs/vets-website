import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { UpdatePage } from '../../../src/js/health-records/containers/UpdatePage';

const props = {
  refresh: {
    statuses: {
      succeeded: [],
      failed: [],
    }
  },
};

describe('<UpdatePage>', () => {
  const tree = SkinDeep.shallowRender(<UpdatePage {...props}/>);

  it('should render', () => {
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });
});
