import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../src/js/hca-rjsf/containers/ConfirmationPage';

const form = {
  submission: {
    timestamp: '2010-01-01'
  }
};

describe('hca <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('h4').text()).to.contain('successfully submitted');
    expect(tree.subTree('.success-alert-box').text()).to.contain('January 1, 2010');
  });
});
