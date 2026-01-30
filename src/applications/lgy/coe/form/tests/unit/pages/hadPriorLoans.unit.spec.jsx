import { expect } from 'chai';
import hadPriorLoans from '../../../pages/hadPriorLoans';

describe('COE hadPriorLoans page', () => {
  it('renders the hadPriorLoansPending yes/no field', () => {
    expect(hadPriorLoans.uiSchema).to.have.property('loanHistory');
    expect(hadPriorLoans.uiSchema.loanHistory).to.have.property(
      'hadPriorLoans',
    );
  });

  it('requires the hadPriorLoans field in the schema', () => {
    expect(hadPriorLoans.schema.properties.loanHistory.required).to.deep.equal([
      'hadPriorLoans',
    ]);
  });
});
