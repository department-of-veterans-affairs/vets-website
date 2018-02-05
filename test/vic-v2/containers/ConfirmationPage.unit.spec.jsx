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
      <ConfirmationPage form={form} saveInProgress={{ user: { login: { currentlyLoggedIn: true } } }}/>
    );

    expect(tree.text()).to.contain('Jane  Doe');
    expect(tree.text()).to.contain('We process applications and print cards in the order we receive them.');
    expect(tree.text()).to.contain('We’ll send you emails updating you on the status of your application. You can also print this page for your records.');
  });
  it('should render not signed in', () => {
    const tree = shallow(
      <ConfirmationPage form={_.set('data.verified', true, form)}/>
    );

    expect(tree.text()).to.contain('Jane  Doe');
    expect(tree.text()).to.contain('We process applications and print cards in the order we receive them.');
    expect(tree.text()).to.contain('We’ll send you emails updating you on the status of your application. You can also print this page for your records.');
  });
  it('should render verified and signed in', () => {
    const tree = shallow(
      <ConfirmationPage form={_.set('data.verified', true, form)} saveInProgress={{ user: { login: { currentlyLoggedIn: true } } }}/>
    );

    expect(tree.text()).not.to.contain('We’ll review your application to verify your eligibility.');
    expect(tree.text()).to.contain('In the meantime, you can print a temporary digital Veteran ID Card.');
    expect(tree.find('VeteranIDCard').exists()).to.be.true;
  });
});
