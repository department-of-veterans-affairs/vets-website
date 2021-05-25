import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import { ConfirmationPage } from '../../containers/ConfirmationPage';
import { ConfirmationPageContent } from '../../../components/ConfirmationPageContent';

const form = {
  submission: {
    response: {
      attributes: {},
    },
  },
  data: {
    'view:applicantInformation': {
      veteranFullName: {
        first: 'Jane',
        last: 'Doe',
      },
    },
  },
};

describe('<ConfirmationPage>', () => {
  it('should render', () => {
    const tree = shallow(<ConfirmationPage form={form} />);
    expect(tree).to.not.be.undefined;
    expect(tree.find(ConfirmationPageContent)).to.not.be.undefined;

    tree.unmount();
  });

  it('displays applicant name', () => {
    const tree = mount(<ConfirmationPage form={form} />);
    expect(tree.find('span.applicant-name').text()).to.eql('for Jane Doe');
    tree.unmount();
  });
});
