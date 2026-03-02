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
    expect(uiSchema.remarriageEndCause, 'remarriageEndCause missing').to.exist;
    expect(uiSchema.endCauseExplanation, 'endCauseExplanation missing').to
      .exist;
    const other = uiSchema.endCauseExplanation;
    expect(other['ui:options']).to.be.an('object');
    expect(other['ui:options'].expandUnder).to.equal('remarriageEndCause');
    expect(other['ui:options'].expandUnderCondition).to.equal('other');
    const requiredFn = other['ui:required'] || other.required;
    expect(requiredFn).to.be.a('function');
    expect(Boolean(requiredFn({ remarriageEndCause: 'other' }))).to.be.true;
    expect(Boolean(requiredFn({ remarriageEndCause: 'divorce' }))).to.be.false;
  });

  it('schema requires remarriageEndCause and remarriageDates', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('remarriageEndCause');
    expect(schema.required).to.include('remarriageDates');
  });
});
