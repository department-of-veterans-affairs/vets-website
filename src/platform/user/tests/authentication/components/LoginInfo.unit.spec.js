import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import LoginInfo from 'platform/user/authentication/components/LoginInfo';

describe('LoginInfo', () => {
  it('renders 6 links', () => {
    const { container } = renderInReduxProvider(<LoginInfo />);
    const links = container.querySelectorAll('a');
    expect(links.length).to.eq(6);
  });
});
