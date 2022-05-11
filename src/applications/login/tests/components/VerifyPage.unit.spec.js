import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import VerifyPage from 'applications/login/components/VerifyPage';
import sinon from 'sinon';
import * as authUtilities from 'platform/user/authentication/utilities';

const defaultProps = {
  location: {
    query: {},
  },
};

describe('VerifyPage', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(function() {
    sandbox.spy(authUtilities, 'verify');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render VerifyPage with correct copy and button', () => {
    const component = shallow(<VerifyPage {...defaultProps} />);
    expect(component.find('h4').text()).to.contain(
      'Please verify your identity before continuing to My VA Health',
    );
    expect(component.find('button').text()).to.contain('Verify your identity');
    component.unmount();
  });

  it('should call verify method on button click', () => {
    const component = shallow(<VerifyPage {...defaultProps} />);
    component.find('button').simulate('click');
    expect(authUtilities.verify.calledOnce).to.be.true;
    component.unmount();
  });
});
