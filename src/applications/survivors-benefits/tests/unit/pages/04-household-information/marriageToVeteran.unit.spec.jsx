import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/marriageToVeteran';

describe('Marriage to Veteran page', () => {
  const { uiSchema, schema } = page;

  it('schema includes required marriage fields', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('marriedAtDeath');
    expect(schema.required).to.include('marriageDate');
    expect(schema.required).to.include('marriageEndDate');
    expect(schema.required).to.include('placeOfMarriage');
    expect(schema.required).to.include('marriageType');
    expect(schema.required).to.include('placeMarriageEnded');
  });

  it('marriageEndDetails ui options and hideIf behave as expected', () => {
    const endDetails = uiSchema.marriageEndDetails;
    expect(endDetails, 'marriageEndDetails not found').to.exist;
    const opts = endDetails['ui:options'];
    expect(opts).to.be.an('object');
    expect(opts.expandUnder).to.equal('marriedAtDeath');
    expect(opts.expandUnderCondition).to.equal(false);
    // hideIf should hide unless marriedAtDeath === false
    expect(opts.hideIf({ marriedAtDeath: true })).to.be.true;
    expect(opts.hideIf({ marriedAtDeath: false })).to.be.false;
  });

  it('marriageEndReason required when marriedAtDeath is false', () => {
    const reason = uiSchema.marriageEndDetails.marriageEndReason;
    expect(reason, 'marriageEndReason not found').to.exist;
    const requiredFn = reason['ui:required'] || reason.required;
    expect(requiredFn).to.be.a('function');
    expect(Boolean(requiredFn({ marriedAtDeath: false }))).to.be.true;
    expect(Boolean(requiredFn({ marriedAtDeath: true }))).to.be.false;
  });

  it('marriageEndOtherReason expandUnder and required behave', () => {
    const other = uiSchema.marriageEndDetails.marriageEndOtherReason;
    expect(other, 'marriageEndOtherReason not found').to.exist;
    const opts = other['ui:options'];
    expect(opts.expandUnder).to.equal('marriageEndReason');
    expect(opts.expandUnderCondition).to.equal('OTHER');
    const requiredFn = other['ui:required'] || other.required;
    expect(requiredFn).to.be.a('function');
    expect(
      Boolean(
        requiredFn({ marriageEndDetails: { marriageEndReason: 'OTHER' } }),
      ),
    ).to.be.true;
    expect(
      Boolean(
        requiredFn({ marriageEndDetails: { marriageEndReason: 'DIVORCE' } }),
      ),
    ).to.be.false;
  });

  it('marriageTypeOther expandUnder and required behave', () => {
    const typeOther = uiSchema.marriageTypeOther;
    expect(typeOther, 'marriageTypeOther not found').to.exist;
    const opts = typeOther['ui:options'];
    expect(opts.expandUnder).to.equal('marriageType');
    expect(opts.expandUnderCondition).to.equal('OTHER_WAY');
    const requiredFn = typeOther['ui:required'] || typeOther.required;
    expect(requiredFn).to.be.a('function');
    expect(Boolean(requiredFn({ marriageType: 'OTHER_WAY' }))).to.be.true;
    expect(Boolean(requiredFn({ marriageType: 'CEREMONY' }))).to.be.false;
  });
});
