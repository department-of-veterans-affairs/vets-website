import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import AuthorizationComponent from '../../components/AuthorizationComponent';

describe('686 <AuthorizationComponent>', () => {
  it('should render loading indicator', () => {
    const authorize = sinon.spy();
    const user = {
      profile: {
        verified: true
      },
      login: {
        currentlyLoggedIn: true
      }
    };

    const tree = shallow(
      <AuthorizationComponent authorize={authorize} isLoading user={user}/>
    );
    expect(tree.find('LoadingIndicator'));
  });

  it('should display inner content if authorized', () => {
    const authorize = sinon.spy();
    const user = {
      profile: {
        verified: false
      },
      login: {
        currentlyLoggedIn: true
      }
    };


    const tree = shallow(
      <AuthorizationComponent isAuthorized authorize={authorize} user={user}>
        <p>Inner content</p>
      </AuthorizationComponent>
    );
    expect(authorize.called).to.be.true;
    expect(tree.find('p').first().text()).to.contain('Inner content');
  });

  it('should not display inner content if not authorized', () => {
    const authorize = sinon.spy();
    const user = {
      profile: {
        verified: true
      },
      login: {
        currentlyLoggedIn: true
      }
    };


    const tree = shallow(
      <AuthorizationComponent authorize={authorize} user={user}>
        <p>Inner content</p>
      </AuthorizationComponent>
    );

    expect(authorize.called).to.be.true;
    expect(tree.find('p').first().text()).to.not.contain('Inner content');
  });
});
