import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { axeCheck } from 'platform/forms-system/test/config/helpers';

import PrivacyAct from '../PrivacyAct';

describe('Health care questionnaire -- Privacy Act', () => {
  it('should render with expiration date', () => {
    const tree = shallow(<PrivacyAct expDate="Expiration date" />);
    expect(tree.text()).to.contain('Expiration date');
    tree.unmount();
  });

  it('should have privacy act link', () => {
    const tree = shallow(<PrivacyAct expDate="Expiration date" />);
    expect(tree.exists('.va-button-link')).to.be.true;
    tree.unmount();
  });

  it('should pass aXe check', () =>
    axeCheck(<PrivacyAct expDate="Expiration date" />));
});
