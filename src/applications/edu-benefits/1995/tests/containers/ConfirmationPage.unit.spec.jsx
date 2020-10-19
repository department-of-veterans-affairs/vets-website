import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../1995/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {},
    },
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe',
    },
    benefit: 'chapter30',
  },
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ConfirmationPage form={form} />);

    expect(tree.subTree('.confirmation-page-title').text()).to.equal(
      "We've received your application.",
    );
    expect(
      tree
        .everySubTree('span')[1]
        .text()
        .trim(),
    ).to.equal('(Form 22-1995)');
    expect(tree.everySubTree('p')[0].text()).to.contain(
      'We usually process applications within 30 days.',
    );
    expect(tree.everySubTree('p')[1].text()).to.contain(
      'We may contact you if we need more information or documents.',
    );
    expect(
      tree.everySubTree('.confirmation-guidance-message')[2].text(),
    ).to.contain('Learn more about what happens after you apply');
  });

  it('should expand documents', () => {
    const tree = SkinDeep.shallowRender(<ConfirmationPage form={form} />);

    // Check to see that div.usa-accordion-content doesn't exist
    expect(tree.subTree('.usa-accordion-content')).to.be.false;

    tree.getMountedInstance().toggleExpanded({ preventDefault: f => f });

    // Check to see that div.usa-accordion-content exists after expanding
    expect(tree.subTree('.usa-accordion-content')).to.be.an('object');
  });
});
