import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { ProfileHubItem } from '../../../components/hub/ProfileHubItem';

describe('<ProfileHubItem />', () => {
  const heading = 'Manage your contact information';
  const content =
    'Review your email address, phone numbers, and mailing address.';
  const href = '/profile/contact-information';

  it('renders a VaLink with the provided heading and href', () => {
    const { container } = render(
      <ProfileHubItem heading={heading} content={content} href={href} />,
    );

    const vaLink = container.querySelector('va-link');
    expect(vaLink).to.exist;
    expect(vaLink.getAttribute('href')).to.equal(href);
    expect(vaLink.getAttribute('text')).to.equal(heading);
  });

  it('renders the descriptive content', () => {
    const { getByText } = render(
      <ProfileHubItem heading={heading} content={content} href={href} />,
    );

    expect(getByText(content)).to.exist;
  });
});
