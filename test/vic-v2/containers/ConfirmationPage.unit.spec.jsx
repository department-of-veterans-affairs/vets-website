import React from 'react';
import _ from 'lodash/fp';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { ConfirmationPage } from '../../../src/js/vic-v2/containers/ConfirmationPage';

const form = {
  submission: {
    response: {
      attributes: {
        confirmationNumber: 'V-VIC-177',
      }
    }
  },
  data: {
    veteranFullName: {
      first: 'Jane',
      last: 'Doe'
    }
  }
};

describe('<ConfirmationPage>', () => {
  it('should render unverified', () => {
    const tree = shallow(
      <ConfirmationPage form={form}/>
    );

    expect(tree.text()).to.contain('Jane  Doe');
    expect(tree.text()).to.contain('We process applications and print cards in the order we receive them.');
    expect(tree.text()).to.contain('We’ll review your application to verify your eligibility. We may contact you');
  });
  it('should render verified', () => {
    const tree = shallow(
      <ConfirmationPage form={_.set('data.verified', true, form)}/>
    );

    expect(tree.text()).not.to.contain('We’ll review your application to verify your eligibility. We may contact you');
    expect(tree.text()).to.contain('You should receive your Veteran ID Card in the mail in about 60 days');
    expect(tree.find('VeteranIDCard').exists()).to.be.true;
  });
});
