import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { AuthorizationComponent } from '../../components/AuthorizationComponent';

describe('686 <AuthorizationComponent>', () => {
  it('should render loading indicator', () => {
    const user = {
      profile: {
        verified: true,
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(<AuthorizationComponent isLoading user={user} />);
    expect(tree.find('LoadingIndicator'));
  });

  it('should display inner content if authorized', () => {
    const user = {
      profile: {
        verified: false,
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <AuthorizationComponent hasError={false} user={user}>
        <p>Inner content</p>
      </AuthorizationComponent>,
    );
    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.contain('Inner content');
  });

  it('should not display inner content if not authorized', () => {
    const user = {
      profile: {
        verified: true,
      },
      login: {
        currentlyLoggedIn: true,
      },
    };

    const tree = shallow(
      <AuthorizationComponent hasError user={user}>
        <p>Inner content</p>
      </AuthorizationComponent>,
    );

    expect(
      tree
        .find('p')
        .first()
        .text(),
    ).to.not.contain('Inner content');
  });
});
