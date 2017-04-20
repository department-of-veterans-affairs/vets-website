import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../../src/js/edu-benefits/1990n/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {}
    }
  },
  applicantInformation: {
    data: {
      veteranFullName: {
        first: 'Jane',
        last: 'Doe'
      }
    }
  },
  benefitSelection: {
    data: {
      benefit: 'chapter35'
    }
  }
};

describe('Edu 1990n <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.edu-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Jane Doe');
  });
});
