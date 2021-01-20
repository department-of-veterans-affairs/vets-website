import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import { ConfirmationPageContent } from '../../../components/ConfirmationPageContent';

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
    appliedForVaEducationBenefits: false,
  },
};

describe('Edu 0994 <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree.find(ConfirmationPageContent)).to.not.be.undefined;
    tree.unmount();
  });

  it('should render 1990 warning when appliedForVaEducationBenefits is false', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree.find('.apply-for-1990')).to.not.be.undefined;
    tree.unmount();
  });
});
