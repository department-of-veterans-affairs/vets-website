import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import {
  ConfirmationGuidance,
  ConfirmationPageSummary,
  ConfirmationPageTitle,
  ConfirmationReturnHome,
} from '../../../components/ConfirmationPage';

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
    expect(tree).to.not.be.undefined;
    expect(tree.find(AlertBox)).to.not.be.undefined;
    expect(tree.find(ConfirmationPageTitle)).to.not.be.undefined;
    expect(tree.find(ConfirmationPageSummary)).to.not.be.undefined;
    expect(tree.find(ConfirmationGuidance)).to.not.be.undefined;
    expect(tree.find(ConfirmationReturnHome)).to.not.be.undefined;

    tree.unmount();
  });

  it('should render 1990 warning when appliedForVaEducationBenefits is false', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree.find('.apply-for-1990')).to.not.be.undefined;
    tree.unmount();
  });
});
