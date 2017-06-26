import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../src/js/pensions/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {}
    }
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe'
    }
  }
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.pensions-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Jane Doe');
  });
});
