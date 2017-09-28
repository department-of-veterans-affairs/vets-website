import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../../src/js/edu-benefits/1995/containers/ConfirmationPage';

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
    },
    benefit: 'chapter30'
  }
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    expect(tree.subTree('.confirmation-page-title').text()).to.equal('Claim received');
    expect(tree.everySubTree('span')[1].text().trim()).to.equal('for Jane Doe');
  });

  it('should expand documents', () => {
    const tree = SkinDeep.shallowRender(
      <ConfirmationPage form={form}/>
    );

    // Check to see that div.usa-accordion-content doesn't exist
    expect(tree.subTree('.usa-accordion-content')).to.be.false;

    tree.getMountedInstance().toggleExpanded({ preventDefault: f => f });

    // Check to see that div.usa-accordion-content exists after expanding
    expect(tree.subTree('.usa-accordion-content')).to.be.an('object');
  });
});
