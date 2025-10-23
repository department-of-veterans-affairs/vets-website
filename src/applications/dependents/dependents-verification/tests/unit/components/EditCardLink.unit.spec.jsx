import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';

import EditCardLink from '../../../components/EditCardLink';

describe('EditCardLink', () => {
  it('renders edit link with correct attributes', () => {
    const mockOnClick = sinon.spy();
    const { container } = render(
      <EditCardLink
        value="123 Main St" // passing in address street (required) value
        name="address"
        onClick={mockOnClick}
      />,
    );

    const link = $('va-link', container);
    expect(link.getAttribute('active')).to.eq('true');
    expect(link.getAttribute('text')).to.eq('Edit');
    expect(link.getAttribute('label')).to.eq('Edit mailing address');
    expect(link.getAttribute('href')).to.equal(
      '/veteran-contact-information/mailing-address',
    );
  });

  it('renders add link with correct attributes', () => {
    const mockOnClick = sinon.spy();
    const { container } = render(
      <EditCardLink value="" name="email" onClick={mockOnClick} />,
    );

    const link = $('va-link', container);
    expect(link.getAttribute('active')).to.eq('true');
    expect(link.getAttribute('text')).to.eq('Add');
    expect(link.getAttribute('label')).to.eq('Add email address');
    expect(link.getAttribute('href')).to.equal(
      '/veteran-contact-information/email',
    );
  });

  it('calls onClick with correct path when clicked', () => {
    const mockOnClick = sinon.spy();
    const { container } = render(
      <EditCardLink value="" name="address" onClick={mockOnClick} />,
    );

    fireEvent.click($('va-link', container));
    expect(mockOnClick.calledOnce).to.be.true;
    expect(mockOnClick.firstCall.args[1]).to.equal(
      '/veteran-contact-information/mailing-address',
    );
  });
});
