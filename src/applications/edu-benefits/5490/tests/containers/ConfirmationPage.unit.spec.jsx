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
    expect(tree.find(ConfirmationPageContent)).to.not.be.undefined;

    tree.unmount();
  });
});
