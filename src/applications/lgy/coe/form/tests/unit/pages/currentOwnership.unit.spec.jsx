import { expect } from 'chai';
import currentOwnership from '../../../pages/currentOwnership';

describe('COE currentOwnership page', () => {
  it('renders the currentOwnershipPending yes/no field', () => {
    expect(currentOwnership.uiSchema).to.have.property('loanHistory');
    expect(currentOwnership.uiSchema.loanHistory).to.have.property(
      'currentOwnership',
    );
  });

  it('requires the currentOwnership field in the schema', () => {
    expect(
      currentOwnership.schema.properties.loanHistory.required,
    ).to.deep.equal(['currentOwnership']);
  });
});
