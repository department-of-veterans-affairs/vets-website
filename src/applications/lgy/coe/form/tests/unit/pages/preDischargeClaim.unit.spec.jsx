import { expect } from 'chai';
import preDischargeClaim from '../../../pages/preDischargeClaim';

describe('COE preDischargeClaim page', () => {
  it('renders the preDischargeClaimPending yes/no field', () => {
    expect(preDischargeClaim.uiSchema).to.have.property('militaryHistory');
    expect(preDischargeClaim.uiSchema.militaryHistory).to.have.property(
      'preDischargeClaim',
    );
  });
  it('renders the additional info and accordion view fields', () => {
    expect(preDischargeClaim.uiSchema).to.have.property(
      'view:preDischargeClaimAdditionalInfo',
    );
    expect(preDischargeClaim.uiSchema).to.have.property(
      'view:preDischargeClaimWhyAccordion',
    );
  });
  it('requires the preDischargeClaim field in the schema', () => {
    expect(
      preDischargeClaim.schema.properties.militaryHistory.required,
    ).to.deep.equal(['preDischargeClaim']);
  });
});
