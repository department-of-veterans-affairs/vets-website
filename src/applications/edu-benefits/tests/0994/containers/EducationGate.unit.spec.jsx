import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { EducationGate } from '../../../0994/containers/EducationGate';

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
    const tree = shallow(<EducationGate form={form} />);

    expect(tree.subTree('.confirmation-page-title').text()).to.equal(
      'Claim received',
    );
    expect(
      tree
        .everySubTree('span')[1]
        .text()
        .trim(),
    ).to.equal('for Jane Doe');
    expect(tree.everySubTree('p')[0].text()).to.contain(
      'We usually process claims within 30 days.',
    );
    expect(tree.everySubTree('p')[1].text()).to.contain(
      'We may contact you for more information or documents.Please print this page for your records',
    );
    expect(
      tree.everySubTree('.confirmation-guidance-message')[0].text(),
    ).to.contain('Find out what happens after you apply.');

    tree.unmount();
  });
});
