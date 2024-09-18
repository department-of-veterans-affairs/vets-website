import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import sinon from 'sinon';
import ContactCard from '../../components/ContactCard';

describe('ContactCard Component', () => {
  const address = {
    address1: '400 South 18th Street',
    address2: 'Room 119',
    city: 'Newark',
    state: 'NJ',
    zip: '07102',
  };
  const repName = 'Brian Daniel';
  const orgName = 'Disabled American Veterans';
  const phone = '7026842997';
  const email = 'bdaniel@veterans.nj.gov';
  let container;
  let mockRecordClick;

  beforeEach(() => {
    mockRecordClick = sinon.spy();
    const rendered = render(
      <ContactCard
        repName={repName}
        orgName={orgName}
        address={address}
        phone={phone}
        email={email}
        recordClick={mockRecordClick}
      />,
    );
    container = rendered.container;
  });

  it('should render the representative and organization name', () => {
    const h3 = $('h3', container);
    expect(h3).to.exist;
    expect(h3.textContent).to.contain(repName);

    const orgNameElement = $('p', container);
    expect(orgNameElement).to.exist;
    expect(orgNameElement.textContent).to.contain(orgName);
  });

  it('should render the address block correctly', () => {
    const googleMapLink = $('a.address-anchor', container);
    expect(googleMapLink).to.exist;
    expect(googleMapLink.textContent).to.contain('400 South 18th Street');
    expect(googleMapLink.textContent).to.contain('Room 119');
    expect(googleMapLink.textContent).to.contain('Newark, NJ 07102');
  });

  it('should render the email link with correct href and text', () => {
    const emailLink = $('a[href^="mailto"]', container);
    expect(emailLink).to.exist;
    expect(emailLink.getAttribute('href')).to.equal(`mailto:${email}`);
    expect(emailLink.textContent).to.equal(email);
  });

  // Shadow DOM elements like va-card, va-icon, and va-telephone are excluded from testing
});
