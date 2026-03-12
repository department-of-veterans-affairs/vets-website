import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { supportingEvidenceOrientation } from '../../content/supportingEvidenceOrientation';

describe('supportingEvidenceOrientation', () => {
  it('should render evidence needed info alert', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
      disability526SupportingEvidenceEnhancement: true,
    };

    const { queryByText } = render(
      React.createElement(supportingEvidenceOrientation, { formData }),
    );
    expect(queryByText('Notice of evidence needed')).to.exist;
  });

  it('renders legacy increase message when enhancement flag is off', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
      disability526SupportingEvidenceEnhancement: false,
    };

    const result = render(
      React.createElement(supportingEvidenceOrientation, { formData }),
    );
    const expectedString =
      'Rated service-connected conditions that have gotten worse';
    result.getByText(expectedString);

    result.getByText(/section 5103 notice/i);
  });

  it('renders legacy new-claim message when enhancement flag is off', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
      disability526SupportingEvidenceEnhancement: false,
    };

    const result = render(
      React.createElement(supportingEvidenceOrientation, { formData }),
    );

    result.getByText(
      /New claims for conditions related to your military service/i,
    );
  });

  // this will cover the new conditional logic of removing the isIncrease check in favor of just checking for isNew
  it('renders enhanced content (including accordion) when enhancement flag is on', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
      disability526SupportingEvidenceEnhancement: true,
    };

    const { container, getByText, queryByText } = render(
      React.createElement(supportingEvidenceOrientation, { formData }),
    );

    expect(queryByText(/section 5103 notice/i)).to.not.exist;
    getByText(/By law, section 5103/i);
    getByText(/Medical records about your conditions/i);
    getByText(
      /Supporting documents and additional forms that support your claim/i,
    );

    expect(container.querySelector('va-accordion')).to.exist;
    const accordionItem = container.querySelector('va-accordion-item');
    expect(accordionItem).to.exist;
    expect(accordionItem.getAttribute('header')).to.equal(
      'Where supporting documents may come from and additional forms',
    );

    getByText(/Records of receiving care/i);
  });
});
