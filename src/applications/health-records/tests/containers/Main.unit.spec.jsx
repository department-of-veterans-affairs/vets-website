import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';

import { Main } from '../../containers/Main';

const props = {
  form: {
    reportTypes: {
      prescriptions: true,
    },
    dateOption: '3mo',
    dateRange: {
      start: null,
      end: null,
    },
  },
};

const context = { router: {} };

describe('<Main>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<Main {...props} />, context);
    const vdom = tree.getRenderOutput();
    expect(vdom).to.exist;
  });

  it('submit button should be enabled if form is valid', () => {
    const tree = SkinDeep.shallowRender(<Main {...props} />, context);
    const submitButton = tree.dive(['button']);
    expect(submitButton.props.disabled).to.not.be.ok;
  });
});
