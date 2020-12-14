import React from 'react';
import { expect } from 'chai';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import { shallow } from 'enzyme';
import {
  ConfirmationGuidance,
  ConfirmationPageSummary,
  ConfirmationPageTitle,
  ConfirmationReturnHome,
  ConfirmationNoDocumentsRequired,
} from '../../../components/ConfirmationPage';

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
    expect(tree).to.not.be.undefined;
    expect(tree.find(ConfirmationPageTitle)).to.not.be.undefined;
    expect(tree.find(ConfirmationPageSummary)).to.not.be.undefined;
    expect(tree.find(ConfirmationGuidance)).to.not.be.undefined;
    expect(tree.find(ConfirmationNoDocumentsRequired)).to.not.be.undefined;
    expect(tree.find(ConfirmationReturnHome)).to.not.be.undefined;

    tree.unmount();
  });
});
