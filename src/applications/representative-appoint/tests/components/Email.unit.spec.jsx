import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Email from '../../components/Email';

describe('Email Component', () => {
  const email = 'test@example.com';
  const mockRecordClick = () => {};

  it('should render the email link with correct href and text', () => {
    const { container } = render(
      <Email email={email} recordClick={mockRecordClick} />,
    );

    const emailLink = $('a', container);
    expect(emailLink).to.exist;
    expect(emailLink.getAttribute('href')).to.equal(`mailto:${email}`);
    expect(emailLink.textContent).to.equal(email);
  });

  it('should call recordClick when the email link is clicked', () => {
    const recordClickSpy = sinon.spy();
    const { container } = render(
      <Email email={email} recordClick={recordClickSpy} />,
    );

    const emailLink = $('a', container);
    emailLink.click();

    expect(recordClickSpy.calledOnce).to.be.true;
  });
});
