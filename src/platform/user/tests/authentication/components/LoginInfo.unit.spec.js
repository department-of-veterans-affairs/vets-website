import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import LoginInfo from 'platform/user/authentication/components/LoginInfo';

describe('LoginInfo', () => {
  it('renders 4 links when toggle is off', () => {
    const { container } = renderInReduxProvider(<LoginInfo />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_credential_button_disabled: false,
        },
      },
    });
    const links = container.querySelectorAll('a');
    expect(links.length).to.eql(4);
  });

  it('renders 5 links when toggle is on', () => {
    const { container } = renderInReduxProvider(<LoginInfo />, {
      initialState: {
        featureToggles: {
          // eslint-disable-next-line camelcase
          mhv_credential_button_disabled: true,
        },
      },
    });

    const links = container.querySelectorAll('a');
    expect(links.length).to.eq(6);
  });
});
