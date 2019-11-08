import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import { FETCH_STATUS } from '../../utils/constants';
import { RegistrationCheck } from '../../containers/RegistrationCheck';

describe('VAOS <RegistrationCheck>', () => {
  it('should render loading', () => {
    const checkRegistration = sinon.spy();
    const tree = shallow(
      <RegistrationCheck
        status={FETCH_STATUS.notStarted}
        checkRegistration={checkRegistration}
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.true;
    expect(checkRegistration.called).to.be.true;
    tree.unmount();
  });

  it('should render error', () => {
    const checkRegistration = sinon.spy();
    const tree = shallow(
      <RegistrationCheck
        status={FETCH_STATUS.failed}
        checkRegistration={checkRegistration}
      />,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.find('AlertBox').exists()).to.be.true;
    tree.unmount();
  });

  it('should render children', () => {
    const checkRegistration = sinon.spy();
    const tree = shallow(
      <RegistrationCheck
        status={FETCH_STATUS.succeeded}
        isEnrolled
        hasRegisteredSystems
        checkRegistration={checkRegistration}
      >
        Testing
      </RegistrationCheck>,
    );

    expect(tree.find('LoadingIndicator').exists()).to.be.false;
    expect(tree.find('AlertBox').exists()).to.be.false;
    expect(tree.text()).to.contain('Testing');
    tree.unmount();
  });

  it('should render no enrollement', () => {
    const checkRegistration = sinon.spy();
    const tree = shallow(
      <RegistrationCheck
        status={FETCH_STATUS.succeeded}
        checkRegistration={checkRegistration}
      >
        Testing
      </RegistrationCheck>,
    );

    expect(tree.find('NoEnrollmentMessage').exists()).to.be.true;
    expect(tree.text()).not.to.contain('Testing');
    tree.unmount();
  });

  it('should render no registration', () => {
    const checkRegistration = sinon.spy();
    const tree = shallow(
      <RegistrationCheck
        status={FETCH_STATUS.succeeded}
        isEnrolled
        checkRegistration={checkRegistration}
      >
        Testing
      </RegistrationCheck>,
    );

    expect(tree.find('NoRegistrationMessage').exists()).to.be.true;
    expect(tree.find('NoEnrollmentMessage').exists()).to.be.false;
    expect(tree.text()).not.to.contain('Testing');
    tree.unmount();
  });
});
