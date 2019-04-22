import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';

import { ConfirmationPageNew } from '../../containers/ConfirmationPageNew';

describe('hca <ConfirmationPageNew>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          timestamp: '2010-01-01',
          formSubmissionId: '3702390024',
        },
      },
      data: {
        veteranFullName: {
          first: 'Joe',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    };

    const tree = SkinDeep.shallowRender(<ConfirmationPageNew form={form} />);

    expect(tree.subTree('.claim-list')).to.exist;
    expect(tree.everySubTree('span')[2].text()).to.contain('Jan. 1, 2010');
    expect(tree.everySubTree('.how-long')[0].text()).to.contain(
      'We usually decide on applications within 1 week.',
    );
    expect(
      tree.everySubTree('.confirmation-guidance-message')[0].text(),
    ).to.contain('Find out what happens after you apply');
  });
  it('should render without response properties', () => {
    const form = {
      submission: {},
      data: {
        veteranFullName: {
          first: 'Joe',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    };
    const tree = SkinDeep.shallowRender(<ConfirmationPageNew form={form} />);
    expect(tree.everySubTree('.how-long')[0].text()).to.contain(
      'We usually decide on applications within 1 week.',
    );
    expect(tree.subTree('.claim-list')).to.be.false;
    expect(
      tree.everySubTree('.confirmation-guidance-message')[0].text(),
    ).to.contain('Find out what happens after you apply');
  });
});
