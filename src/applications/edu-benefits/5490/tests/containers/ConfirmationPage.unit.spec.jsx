import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../../5490/containers/ConfirmationPage';

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
    relativeFullName: {
      first: 'Jane',
      last: 'Doe',
    },
    benefit: 'chapter35',
  },
};

describe('Edu 5490 <ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree).to.not.be.undefined;
    expect(tree.find(ConfirmationPageTitle)).to.not.be.undefined;
    expect(tree.find(ConfirmationPageSummary)).to.not.be.undefined;
    expect(tree.find(ConfirmationGuidance)).to.not.be.undefined;
    expect(tree.find(ConfirmationReturnHome)).to.not.be.undefined;

    tree.unmount();
  });
});
