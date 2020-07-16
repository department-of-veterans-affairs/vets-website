import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../containers/ConfirmationPage';

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
    const tree = shallow(<ConfirmationPage form={form} />);

    expect(tree.find('.confirmation-page-title').text()).to.equal(
      "We've received your application.",
    );
    expect(
      tree
        .find('span')
        .at(2)
        .text()
        .trim(),
    ).to.equal('for Jane Doe');
    expect(
      tree
        .find('p')
        .at(0)
        .text(),
    ).to.contain(
      'We usually process claims within 30 days.We may contact you for more information or documents.',
    );
    expect(
      tree
        .find('.confirmation-guidance-message')
        .at(0)
        .text(),
    ).to.contain('Find out what happens after you apply');

    tree.unmount();
  });
});
