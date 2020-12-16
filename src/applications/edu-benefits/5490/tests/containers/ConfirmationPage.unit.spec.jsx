import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPage } from '../../../5490/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {},
    },
  },
  data: {
    relativeFullName: {
      first: 'Jane',
      last: 'Doe',
    },
    benefit: 'chapter35',
  },
};

describe('Edu 5490 <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = SkinDeep.shallowRender(<ConfirmationPage form={form} />);

    expect(tree.subTree('.confirmation-page-title').text()).to.equal(
      'We’ve received your application.',
    );
    expect(
      tree
        .everySubTree('span')[0]
        .text()
        .trim(),
    ).to.equal('for Jane Doe');
    expect(tree.everySubTree('p')[0].text()).to.contain(
      'We usually process claims within 30 days.',
    );
    expect(tree.everySubTree('p')[1].text()).to.contain(
      'We may contact you if we need more information or documents.',
    );
    expect(
      tree.everySubTree('.confirmation-guidance-message')[0].text(),
    ).to.contain('We usually decide on applications within 30 days.');
  });
});
