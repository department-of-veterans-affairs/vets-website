import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import EnrollmentHistory from '../../../src/js/post-911-gib-status/components/EnrollmentHistory.jsx';

const props = {
  enrollmentData: {
  }
};

describe('<EnrollmentHistory>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<EnrollmentHistory {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  // test logic controlling which components are shown depending on data
});

