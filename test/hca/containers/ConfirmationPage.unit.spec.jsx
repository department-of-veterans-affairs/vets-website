import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../src/js/hca/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      timestamp: '2010-01-01'
    }
  }
};

describe('hca <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('h4').text()).to.contain('successfully submitted');
    expect(tree.subTree('.success-alert-box').text()).to.contain('January 1, 2010');
    expect(tree.everySubTree('p')[0].text()).to.contain('We are processing your application.The Department of Veterans Affairs will contact you when we finish our review.Please print this page for your records.');
    expect(tree.everySubTree('.confirmation-guidance-message')[0].text()).to.contain('Find out what happens after you apply.');
    expect(tree.everySubTree('.confirmation-guidance-message')[1].text()).to.contain('If you have questions, call 1-877-222-VETS (8387) and press 2.');
  });
  it('should render without time', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={{
        submission: {}
      }}/>
    );

    expect(tree.subTree('h4').text()).to.contain('successfully submitted');
  });
});
