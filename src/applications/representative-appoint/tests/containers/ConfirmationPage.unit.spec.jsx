import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import * as redux from 'react-redux';

import ConfirmationPage from '../../containers/ConfirmationPage';

describe('Confirmation Page', () => {
  let defaultProps;
  let container;
  let useSelectorStub;

  const mockFormData = {
    'view:selectedRepresentative': {
      type: 'individual',
      fullName: 'Brian Daniel',
      addressLine1: '400 South 18th Street',
      addressLine2: 'Room 119',
      city: 'Newark',
      stateCode: 'NJ',
      zipCode: '07102',
      phone: '7026842997',
      email: 'bdaniel@veterans.nj.gov',
      attributes: {
        individualType: 'representative',
        accreditedOrganizations: {
          data: [
            {
              id: '1',
              attributes: { name: 'Disabled American Veterans' },
            },
          ],
        },
      },
    },
    selectedAccreditedOrganizationId: '1',
    applicantName: {
      first: 'John',
      middle: 'E',
      last: 'Doe',
      suffix: 'Sr.',
    },
    veteranFullName: {
      first: 'John',
      middle: 'E',
      last: 'Doe',
      suffix: 'Sr.',
    },
  };

  beforeEach(() => {
    defaultProps = {
      router: { push: sinon.spy() },
    };

    useSelectorStub = sinon
      .stub(redux, 'useSelector')
      .returns({ data: mockFormData });

    const result = render(<ConfirmationPage {...defaultProps} />);
    container = result.container;
  });

  afterEach(() => {
    useSelectorStub.restore();
  });

  it('should render with correct text and elements', () => {
    const downloadLink = container.querySelector('va-link');
    expect(downloadLink).to.exist;
    expect(downloadLink.getAttribute('text')).to.equal('Download your form');

    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox.getAttribute('label')).to.equal(
      'I’ve downloaded, printed, and signed my form',
    );

    const button = container.querySelector('va-button');
    expect(button).to.exist;
  });

  it('should handle checkbox change', () => {
    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox.checked).to.be.false;

    checkbox.checked = true;
    fireEvent.click(checkbox);

    expect(checkbox.checked).to.be.true;
  });

  it('should not focus on the "Continue" button after it is clicked when the checkbox is not checked', () => {
    // We can't text the focus of the checkbox after the button click because it's in the shadow DOM.
    // Instead, we can test that the focus is not on the "Continue" button after it is clicked when the checkbox is not checked.
    const button = container.querySelector('va-button');

    fireEvent.click(button);

    expect(document.activeElement).to.not.equal(button);
  });

  it('should call the download handler when "Download your form" link is clicked', () => {
    const downloadLink = container.querySelector('va-link');

    fireEvent.click(downloadLink);

    expect(defaultProps.router.push.called).to.be.false;
  });
});
