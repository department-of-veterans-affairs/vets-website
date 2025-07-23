import { render } from '@testing-library/react';
import { expect } from 'chai';
import { supportingEvidenceOrientation } from '../../content/supportingEvidenceOrientation';

describe('supportingEvidenceOrientation', () => {
  it('should render evidence needed info alert', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };

    const { queryByText } = render(supportingEvidenceOrientation({ formData }));
    expect(queryByText('Notice of evidence needed')).to.exist;
  });

  it('renders increase message when claiming only an increase', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };
    const result = render(supportingEvidenceOrientation({ formData }));
    const expectedString =
      'Rated service-connected conditions that have gotten worse';
    result.getByText(expectedString);
  });

  it('renders new message when claiming a new condition', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
    };
    const expectedString =
      'New claims for conditions related to your military service';
    const result = render(supportingEvidenceOrientation({ formData }));
    result.getByText(expectedString);
  });
});
