import React from 'react';
import { expect } from 'chai';

import { ConfirmationPage } from '../../../1990/containers/ConfirmationPage';
import { shallow } from 'enzyme';
import { ConfirmationPageContent } from '../../../components/ConfirmationPageContent';

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
    'view:selectedBenefits': {
      chapter33: true,
    },
  },
};

describe('Edu 1990 <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree).to.not.be.undefined;
    expect(tree.find(ConfirmationPageContent)).to.not.be.undefined;

    tree.unmount();
  });
});
