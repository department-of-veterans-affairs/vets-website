import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import Phone from '../../components/Phone';

describe('Phone Component', () => {
  const contact = '7026842997';
  const extension = '1234';
  const mockRecordClick = () => {};

  it('should render the phone link with correct contact and extension', () => {
    const { container } = render(
      <Phone
        contact={contact}
        extension={extension}
        recordClick={mockRecordClick}
      />,
    );

    const phoneLink = $('va-telephone', container);
    expect(phoneLink).to.exist;
    expect(phoneLink.getAttribute('contact')).to.equal(contact);
    expect(phoneLink.getAttribute('extension')).to.equal(extension);
  });

  it('should call recordClick when the phone link is clicked', () => {
    const recordClickSpy = sinon.spy();
    const { container } = render(
      <Phone
        contact={contact}
        extension={extension}
        recordClick={recordClickSpy}
      />,
    );

    const phoneLink = $('va-telephone', container);
    phoneLink.click();

    expect(recordClickSpy.calledOnce).to.be.true;
  });
});
