import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { AuthorizationComponent } from '../../components/AuthorizationComponent';

describe('686 <AuthorizationComponent>', () => {
  it('should render loading indicator', () => {

    const tree = shallow(
      <AuthorizationComponent isLoading/>
    );
    expect(tree.find('LoadingIndicator'));
  });

  it('should display inner content if authorized', () => {

    const tree = shallow(
      <AuthorizationComponent isAuthorized>
        <p>Inner content</p>
      </AuthorizationComponent>
    );
    expect(tree.find('p').first().text()).to.contain('Inner content');
  });

  it('should not display inner content if not authorized', () => {

    const tree = shallow(
      <AuthorizationComponent>
        <p>Inner content</p>
      </AuthorizationComponent>
    );

    expect(tree.find('p').first().text()).to.not.contain('Inner content');
  });
});
