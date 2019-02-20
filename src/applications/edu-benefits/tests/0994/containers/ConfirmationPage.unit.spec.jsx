import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../../0994/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {},
    },
  },
  data: {
    applicantFullName: {
      first: 'Jane',
      last: 'Doe',
    },
  },
};

describe('Edu 0994 <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);

    expect(tree.find('.confirmation-page-title').text()).to.equal(
      'Claim received',
    );

    const name = tree.find('span').at(1);
    expect(name.text()).contains(form.data.applicantFullName.first);
    expect(name.text()).contains(form.data.applicantFullName.last);

    expect(
      tree
        .find('p')
        .at(0)
        .text(),
    ).to.contain('We usually process claims within 30 days.');

    expect(
      tree
        .find('p')
        .at(1)
        .text(),
    ).to.contain(
      'We may contact you for more information or documents.Please print this page for your records',
    );

    expect(
      tree
        .find('.confirmation-guidance-message')
        .at(0)
        .text(),
    ).to.equal('Find out what happens after you apply.');

    tree.unmount();
  });
});
