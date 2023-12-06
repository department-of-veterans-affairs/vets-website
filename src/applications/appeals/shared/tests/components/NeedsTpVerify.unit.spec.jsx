import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import NeedsToVerify from '../../components/NeedsToVerify';

describe('<NeedsToVerify>', () => {
  const heading =
    'You’ll need to verify your identity to access more VA.gov tools and features';
  const setup = ({ pathname = '/introduction' } = {}) => {
    return (
      <div>
        <NeedsToVerify pathname={pathname} />
      </div>
    );
  };
  it('should render', () => {
    const { container } = render(setup());
    expect($('va-alert', container)).to.exist;
    expect($('h2', container).textContent).to.eq(heading);
  });

  it('should capture google analytics', async () => {
    global.window.dataLayer = [];
    render(setup());

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
