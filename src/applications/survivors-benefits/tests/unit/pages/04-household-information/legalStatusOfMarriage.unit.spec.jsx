import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/legalStatusOfMarriage';

describe('Legal status of marriage page', () => {
  const { uiSchema, schema } = page;

  it('has required awareOfLegalIssues in schema', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('awareOfLegalIssues');
  });

  it('legalIssueExplanation expandUnder options are correct', () => {
    expect(uiSchema).to.be.an('object');
    const explanation = uiSchema.legalIssueExplanation;
    expect(explanation, 'legalIssueExplanation not found in uiSchema').to.exist;
    expect(explanation['ui:options']).to.be.an('object');
    expect(explanation['ui:options'].expandUnder).to.equal(
      'awareOfLegalIssues',
    );
    expect(explanation['ui:options'].expandUnderCondition).to.equal(true);
  });

  it('legalIssueExplanation required callback respects awareOfLegalIssues', () => {
    const explanation = uiSchema.legalIssueExplanation;
    // required function provided via textUI required option
    const requiredFn = explanation['ui:required'];
    expect(requiredFn).to.be.a('function');

    const falseData = { awareOfLegalIssues: false };
    expect(Boolean(requiredFn(falseData))).to.be.false;

    const trueData = { awareOfLegalIssues: true };
    expect(Boolean(requiredFn(trueData))).to.be.true;
  });
});
