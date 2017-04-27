import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import _ from 'lodash';

import RequiredLoginView from '../../../src/js/common/components/RequiredLoginView.jsx';

describe('<RequiredLoginView>', () => {
  const anonymousUser = {
    accountType: null,
    dob: null,
    email: null,
    gender: null,
    userFullName: {
      first: null,
      last: null,
      middle: null,
      suffix: null
    }
  };
  const loa1User = {
    accountType: 1,
    dob: null,
    email: 'fake@aol.com',
    gender: null,
    services: ['user-profile'],
    userFullName: {
      first: null,
      last: null,
      middle: null,
      suffix: null
    }
  };

  const loa3User = {
    accountType: 3,
    dob: '1984-07-17',
    email: 'fake@aol.com',
    gender: 'M',
    services: ['facilities', 'hca', 'user-profile', 'edu-benefits'],
    status: 'OK',
    userFullName: {
      first: 'WILLIAM',
      last: 'RYAN',
      middle: 'PETER',
      suffix: null
    }
  };

  const defaultProps = {
    authRequired: 3,
    serviceRequired: 'hca',
    userProfile: loa1User,
    loginUrl: 'http://fake-login-url'
  };

  class TestChildComponent extends React.Component {
    render() {
      return (<div>Child Component {this.props.name}</div>);
    }
  }

  function setup(props = {}) {
    const mergedProps = _.merge({}, defaultProps, props);
    const tree = SkinDeep.shallowRender(
      <RequiredLoginView {...mergedProps}>
        <div>Test Child</div>
      </RequiredLoginView>
    );

    const instance = tree.getMountedInstance();
    instance.setState({ loading: false });
    const vdom = tree.getRenderOutput();

    return { tree, instance, mergedProps, vdom };
  }

  it('should render', () => {
    const { vdom } = setup();
    expect(vdom).to.not.be.undefined;
  });

  it('should render a loading graphic while loading', () => {
    const { tree, instance } = setup();
    instance.setState({ loading: true });
    const loadingIndicatorElement = tree.dive(['LoadingIndicator']);
    expect(loadingIndicatorElement.text()).to.contain('Loading your information');
  });

  it('should display children irrespective of isServiceAvailableForUse', () => {
    const loa3Props = _.merge({}, defaultProps, { userProfile: loa3User });
    const tree = SkinDeep.shallowRender(
      <RequiredLoginView {...loa3Props}>
        <TestChildComponent name="one"/>
        <TestChildComponent name="two"/>
        <TestChildComponent name="three"/>
      </RequiredLoginView>
    );
    tree.getMountedInstance().setState({
      loading: false,
      isServiceAvailableForUse: false
    });

    // each direct child should get their props.isDataAvailable set
    tree.props.children.forEach((child) => {
      expect(child.props.isDataAvailable).to.equal(false);
    });
  });

  describe('logged in at LOA 1', () => {
    describe('authRequired=3', () => {
      it('should prompt for verification', () => {
        const { tree } = setup({ userProfile: loa1User });
        expect(tree.toString()).to.contain('Verify your Identity with ID.me');
      });
    });
    describe('authRequired=1', () => {
      it('should display children elements', () => {
        const { tree } = setup({ authRequired: 1, serviceRequired: 'user-profile' });
        expect(tree.toString()).to.equal('<div><div>Test Child</div></div>');
      });
    });
  });
  describe('logged in at LOA 3', () => {
    it('should display children elements', () => {
      const { tree } = setup({ userProfile: loa3User });
      expect(tree.toString()).to.equal('<div><div>Test Child</div></div>');
    });
    describe('userProfile.status=SERVER_ERROR', () => {
      it('should display server error message', () => {
        const serverErrorProfile = _.merge({}, loa3User, { status: 'SERVER_ERROR' });
        const { tree } = setup({ userProfile: serverErrorProfile });
        expect(tree.toString()).to.contain('Sorry, our system is temporarily down while we fix a few things');
      });
    });
    describe('userProfile.status=NOT_FOUND', () => {
      it('should display not found message', () => {
        const notFoundProfile = _.merge({}, loa3User, { status: 'NOT_FOUND' });
        const { tree } = setup({ userProfile: notFoundProfile });
        expect(tree.toString()).to.contain('We couldn&#x27;t find your records with that information.');
      });
    });
  });
  describe('not logged in', () => {
    it('should prompt for login', () => {
      const { tree } = setup({ userProfile: anonymousUser });
      expect(tree.toString()).to.contain('Sign In to Your Vets.gov Account');
    });
    it('should display children when no LOA required', () => {
      const { tree } = setup({ userProfile: anonymousUser, authRequired: null });
      expect(tree.toString()).to.equal('<div><div>Test Child</div></div>');
    });
  });
});
