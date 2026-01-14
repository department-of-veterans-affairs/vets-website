import React from 'react';
import { expect } from 'chai';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { supportingEvidenceOrientation } from '../../content/supportingEvidenceOrientation';

describe('supportingEvidenceOrientation', () => {
  it('should render evidence needed info alert', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };

    const { queryByText } = renderInReduxProvider(
      React.createElement(supportingEvidenceOrientation, { formData }),
      {
        initialState: {
          featureToggles: {
            [FEATURE_FLAG_NAMES.disability526SupportingEvidenceEnhancement]: true,
          },
        },
      },
    );
    expect(queryByText('Notice of evidence needed')).to.exist;
  });

  it('renders legacy increase message when enhancement flag is off', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };

    const result = renderInReduxProvider(
      React.createElement(supportingEvidenceOrientation, { formData }),
      {
        initialState: {
          featureToggles: {
            [FEATURE_FLAG_NAMES.disability526SupportingEvidenceEnhancement]: false,
          },
        },
      },
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
    };

    const result = renderInReduxProvider(
      React.createElement(supportingEvidenceOrientation, { formData }),
      {
        initialState: {
          featureToggles: {
            [FEATURE_FLAG_NAMES.disability526SupportingEvidenceEnhancement]: false,
          },
        },
      },
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
    };

    const { container, getByText, queryByText } = renderInReduxProvider(
      React.createElement(supportingEvidenceOrientation, { formData }),
      {
        initialState: {
          featureToggles: {
            [FEATURE_FLAG_NAMES.disability526SupportingEvidenceEnhancement]: true,
          },
        },
      },
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
