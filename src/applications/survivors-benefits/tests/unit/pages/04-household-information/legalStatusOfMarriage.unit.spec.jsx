import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/legalStatusOfMarriage';

describe('Legal status of marriage page', () => {
  const { uiSchema, schema } = page;

  it('has required awareOfLegalIssues in schema', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('validMarriage');
  });

  it('marriageValidityExplanation expandUnder options are correct', () => {
    expect(uiSchema).to.be.an('object');
    const explanation = uiSchema.marriageValidityExplanation;
    expect(explanation, 'marriageValidityExplanation not found in uiSchema').to
      .exist;
    expect(explanation['ui:options']).to.be.an('object');
    expect(explanation['ui:options'].expandUnder).to.equal('validMarriage');
    expect(explanation['ui:options'].expandUnderCondition).to.equal(true);
  });

  it('marriageValidityExplanation required callback respects validMarriage', () => {
    const explanation = uiSchema.marriageValidityExplanation;
    // required function provided via textUI required option
    const requiredFn = explanation['ui:required'];
    expect(requiredFn).to.be.a('function');

    const falseData = { validMarriage: false };
    expect(Boolean(requiredFn(falseData))).to.be.false;

    const trueData = { validMarriage: true };
    expect(Boolean(requiredFn(trueData))).to.be.true;
  });
});
