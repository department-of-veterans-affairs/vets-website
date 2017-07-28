import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../../src/js/edu-benefits/1990e/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {}
    }
  },
  data: {
    relativeFullName: {
      first: 'Jane',
      last: 'Doe'
    },
    benefit: 'chapter35'
  }
};

describe('Edu 1990e <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.confirmation-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Jane Doe');
  });
});
