import { render } from '@testing-library/react';
import { supportingEvidenceOrientation } from '../../content/supportingEvidenceOrientation';

describe('supportingEvidenceOrientation', () => {
  it('should render evidence needed info alert', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };
    const result = render(supportingEvidenceOrientation({ formData }));
    const expectedString = 'Notice of evidence needed';
    result.getByText(expectedString);
  });

  it('renders increase message when claiming only an increase', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };
    const result = render(supportingEvidenceOrientation({ formData }));
    const expectedString = 'Your rated service-connected conditions';
    result.getByText(expectedString);
  });

  it('renders new message when claiming a new condition', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
    };
    const expectedString = 'Your new service-connected conditions';
    const result = render(supportingEvidenceOrientation({ formData }));
    result.getByText(expectedString);
  });
});
