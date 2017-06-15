import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import EnrollmentPeriod from '../../../src/js/post-911-gib-status/components/EnrollmentPeriod.jsx';

const props = {
  id: 'abc',
  enrollment: {
  }
};

describe('<EnrollmentPeriod>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<EnrollmentPeriod {...props}/>);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.not.be.undefined;
  });

  // should render enrollment data

  // should not show "change history" collapsible panel if enrollment has no amendments

  // should show "change history" collapsible panel if enrollment has at least 1 amendment

  // should not show change history list if panel is collapsed

  // should show chage history list of panel is expanded
});
