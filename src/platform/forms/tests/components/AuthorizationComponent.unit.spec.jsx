import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { AuthorizationComponent } from '../../components/AuthorizationComponent';

describe('686 <AuthorizationComponent>', () => {
  const authorize = () => true;
  const formConfig = {
    authorizationMessage: <div>authorization message</div>,
  };
  it('should render loading indicator', () => {
    const tree = shallow(
      <AuthorizationComponent
        isLoading
        formConfig={formConfig}
        authorize={authorize}
      />,
    );
    expect(tree.find('LoadingIndicator'));
  });

  it('should display inner content if authorized', () => {
    const tree = shallow(
      <AuthorizationComponent
        isAuthorized
        formConfig={formConfig}
        authorize={authorize}
      >
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
    const tree = shallow(
      <AuthorizationComponent formConfig={formConfig} authorize={authorize}>
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
