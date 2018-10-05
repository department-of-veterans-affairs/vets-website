import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';

import { ConfirmationPage } from '../../../feedback-tool/containers/ConfirmationPage';

describe('GI Feedback Tool <ConfirmationPage>', () => {
  it('should render', () => {
    const form = {
      submission: {
        response: {
          caseNumber: '3702390024',
        },
      },
      data: {
        applicantFullName: {
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
        .find('.confirmation-page-title')
        .at(0)
        .text(),
    ).to.contain('Your feedback has been submitted');
    expect(tree.find('.claim-list').exists()).to.be.true;
    expect(
      tree
        .find('span')
        .at(2)
        .text(),
    ).to.contain('3702390024');
    expect(
      tree
        .find('span')
        .at(1)
        .text(),
    ).to.contain(moment().format('MMM D, YYYY'));
    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.contain(
      'We may contact you if we have questions or need more information.',
    );
  });
  it('should render without the name properties', () => {
    const form = {
      submission: {
        response: {
          caseNumber: '3702390024',
        },
      },
      data: {},
    };
    const tree = shallow(<ConfirmationPage form={form} />);

    expect(
      tree
        .find('.confirmation-page-title')
        .at(0)
        .text(),
    ).to.contain('Your feedback has been submitted');
    expect(tree.find('.inset').text()).to.not.contain('for');
    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.contain(
      'We may contact you if we have questions or need more information.',
    );
  });
  it('should render without the response properties', () => {
    const form = {
      submission: {},
      data: {
        applicantFullName: {
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
        .find('.confirmation-page-title')
        .at(0)
        .text(),
    ).to.contain('Your feedback has been submitted');
    expect(tree.find('.claim-list').exists()).to.be.false;
    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.contain(
      'We may contact you if we have questions or need more information.',
    );
  });
});
