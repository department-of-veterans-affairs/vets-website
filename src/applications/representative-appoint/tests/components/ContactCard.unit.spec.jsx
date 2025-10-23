import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import sinon from 'sinon';
import ContactCard from '../../components/ContactCard';

describe('ContactCard Component', () => {
  const addressData = {
    addressLine1: '400 South 18th Street',
    addressLine2: 'Room 119',
    city: 'Newark',
    stateCode: 'NJ',
    zipCode: '07102',
  };
  const repName = 'Brian Daniel';
  const orgName = 'Disabled American Veterans';
  const phone = '7026842997';
  const email = 'bdaniel@veterans.nj.gov';
  let container;
  let mockRecordClick;

  const renderComponent = (props = {}) => {
    const defaultProps = {
      repName,
      orgName,
      addressData,
      phone,
      email,
      recordClick: mockRecordClick,
      ...props,
    };

    return render(<ContactCard {...defaultProps} />).container;
  };

  beforeEach(() => {
    mockRecordClick = sinon.spy();
    container = renderComponent();
  });

  const testHeaderContent = (renderedContainer, expectedName) => {
    const h3 = $('h3', renderedContainer);
    expect(h3).to.exist;
    expect(h3.textContent).to.contain(expectedName);
  };

  it('should render the representative and organization name when both names are given', () => {
    testHeaderContent(container, orgName);

    const repNameElement = $('p', container);
    expect(repNameElement).to.exist;
    expect(repNameElement.textContent).to.contain(repName);
  });

  it('should only render the representative name when the organization name is not given', () => {
    const renderedContainer = renderComponent({ orgName: undefined });
    testHeaderContent(renderedContainer, repName);

    const orgNameElement = $('p', renderedContainer);
    expect(orgNameElement).not.to.exist;
  });

  it('should only render the organization name when the representative name is not given', () => {
    const renderedContainer = renderComponent({ repName: undefined });
    testHeaderContent(renderedContainer, orgName);

    const orgNameElement = $('p', renderedContainer);
    expect(orgNameElement).not.to.exist;
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
