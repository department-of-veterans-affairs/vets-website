import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../../0993/containers/ConfirmationPage';

describe('Opt Out <ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          attributes: {
            timestamp: '2010-01-01',
            confirmationNumber: '3702390024',
          },
        },
      },
      data: {
        claimantFullName: {
          first: 'Joe',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    };

    const tree = shallow(<ConfirmationPage form={form} />);

    expect(
      tree
        .find('.schemaform-confirmation-section-header')
        .at(0)
        .text(),
    ).to.contain('Your opt-out form has been submitted');
    expect(tree.find('.claim-list').exists()).to.be.true;
    expect(
      tree
        .find('span')
        .at(1)
        .text(),
    ).to.contain('3702390024');
    expect(
      tree
        .find('span')
        .at(2)
        .text(),
    ).to.contain('Jan. 1, 2010');
    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.contain(
      'We may contact you if we have questions or need more information. You can print this page for your records.',
    );
  });

  it('should render without the response properties', () => {
    const form = {
      submission: {},
      data: {
        claimantFullName: {
          first: 'Joe',
          middle: 'Marjorie',
          last: 'Smith',
          suffix: 'Sr.',
        },
      },
    };
    const tree = shallow(<ConfirmationPage form={form} />);

    expect(
      tree
        .find('.schemaform-confirmation-section-header')
        .at(0)
        .text(),
    ).to.contain('Your opt-out form has been submitted');
    expect(tree.find('.claim-list').exists()).to.be.false;
    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.contain(
      'We may contact you if we have questions or need more information. You can print this page for your records.',
    );
  });
});
