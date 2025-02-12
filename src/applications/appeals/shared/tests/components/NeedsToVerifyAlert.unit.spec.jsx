import React from 'react';
import { expect } from 'chai';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import NeedsToVerifyAlert, {
  heading,
} from '../../components/NeedsToVerifyAlert';

describe('<NeedsToVerifyAlert>', () => {
  it('should render', () => {
    const { container } = renderInReduxProvider(<NeedsToVerifyAlert />, {
      initialState: {
        user: { profile: { signIn: { serviceName: 'idme' } } },
      },
    });
    const signInAlert = $('va-alert-sign-in', container);
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('heading-level')).to.eql('2');
  });

  it('should capture google analytics', async () => {
    global.window.dataLayer = [];
    renderInReduxProvider(<NeedsToVerifyAlert />, {
      initialState: {
        user: { profile: { signIn: { serviceName: 'idme' } } },
      },
    });

    await waitFor(() => {
      const event = global.window.dataLayer.slice(-1)[0];
      expect(event).to.deep.equal({
        event: 'visible-alert-box',
        'alert-box-type': 'continue',
        'alert-box-heading': heading,
        'error-key': 'not_verified',
        'alert-box-full-width': false,
        'alert-box-background-only': false,
        'alert-box-closeable': false,
        'reason-for-alert': `Not verified`,
      });
    });
  });
});
