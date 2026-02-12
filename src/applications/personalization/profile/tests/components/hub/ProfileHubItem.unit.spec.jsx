import React from 'react';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ProfileHubItem } from '../../../components/hub/ProfileHubItem';
import * as helpers from '../../../helpers';

describe('<ProfileHubItem />', () => {
  const heading = 'Manage your contact information';
  const content =
    'Review your email address, phone numbers, and mailing address.';
  const href = '/profile/contact-information';

  beforeEach(() => {
    sinon.stub(helpers, 'handleRouteChange').callsFake(() => {});
  });

  afterEach(() => {
    helpers.handleRouteChange.restore();
  });

  it('renders a VaLink with the provided heading and href', () => {
    const container = render(
      <ProfileHubItem
        heading={heading}
        content={content}
        href={href}
        reactLink
      />,
    );

    const vaLink = container.container.querySelector('va-link');
    expect(vaLink).to.exist;
    expect(vaLink.getAttribute('href')).to.equal(href);
    expect(vaLink.getAttribute('text')).to.equal(heading);
    vaLink.click();
    expect(helpers.handleRouteChange.called).to.be.true;
  });

  it('renders the descriptive content', () => {
    const container = render(
      <ProfileHubItem heading={heading} content={content} href={href} />,
    );

    expect(container.getByText(content)).to.exist;
  });
});
