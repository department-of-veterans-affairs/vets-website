import { expect } from 'chai';
import { supportingEvidenceOrientation } from '../../content/supportingEvidenceOrientation';

describe('supportingEvidenceOrientation', () => {
  it('renders increase only li if only claiming increase', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': false,
        'view:claimingIncrease': true,
      },
    };
    const result = supportingEvidenceOrientation({ formData });
    const expectedString = 'Your rated service-connected disabilities';
    expect(result.props.children[1].props.children[0].props.children).to.equal(
      expectedString,
    );
  });

  it('renders new only li if only claiming new', () => {
    const formData = {
      'view:claimType': {
        'view:claimingNew': true,
        'view:claimingIncrease': false,
      },
    };
    const expectedString =
      'Your new service-connected disabilities or conditions';
    const result = supportingEvidenceOrientation({ formData });
    expect(result.props.children[1].props.children[1].props.children).to.equal(
      expectedString,
    );
  });
});
