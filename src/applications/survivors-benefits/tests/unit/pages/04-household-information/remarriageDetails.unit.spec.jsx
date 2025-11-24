import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/remarriageDetails';

describe('Remarriage details page', () => {
  const { uiSchema, schema, depends } = page;

  it('depends only when remarried is true', () => {
    expect(depends).to.be.a('function');
    expect(Boolean(depends({ remarried: true }))).to.be.true;
    expect(Boolean(depends({ remarried: false }))).to.be.false;
    expect(Boolean(depends({}))).to.be.false;
  });

  it('uiSchema contains remarriage fields and options are correct', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema.remarriageEndReason, 'remarriageEndReason missing').to
      .exist;
    expect(
      uiSchema.remarriageEndOtherReason,
      'remarriageEndOtherReason missing',
    ).to.exist;
    const other = uiSchema.remarriageEndOtherReason;
    expect(other['ui:options']).to.be.an('object');
    expect(other['ui:options'].expandUnder).to.equal('remarriageEndReason');
    expect(other['ui:options'].expandUnderCondition).to.equal('OTHER');
    const requiredFn = other['ui:required'] || other.required;
    expect(requiredFn).to.be.a('function');
    expect(Boolean(requiredFn({ remarriageEndReason: 'OTHER' }))).to.be.true;
    expect(Boolean(requiredFn({ remarriageEndReason: 'DIVORCE' }))).to.be.false;
  });

  it('schema requires remarriageEndReason and remarriageDate', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('remarriageEndReason');
    expect(schema.required).to.include('remarriageDate');
  });
});
