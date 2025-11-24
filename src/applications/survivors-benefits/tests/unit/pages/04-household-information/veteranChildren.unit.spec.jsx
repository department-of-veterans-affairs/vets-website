import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/veteranChildren';

describe('Children of Veteran page', () => {
  const { uiSchema, schema } = page;

  it('uiSchema contains expectingChild and hadChildWithVeteran', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema.expectingChild, 'expectingChild missing').to.exist;
    expect(uiSchema.hadChildWithVeteran, 'hadChildWithVeteran missing').to
      .exist;
  });

  it('schema requires expectingChild and hadChildWithVeteran', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('expectingChild');
    expect(schema.required).to.include('hadChildWithVeteran');
  });

  it('depends logic shows page for non-spouse or spouse with previous marriages', () => {
    const { depends } = page;
    expect(depends, 'depends function missing').to.be.a('function');

    // Spouse with NO previous marriages -> should skip (false)
    expect(
      depends({ claimantRelationship: 'SPOUSE', hadPreviousMarriages: false }),
    ).to.be.false;

    // Spouse with previous marriages -> should show (true)
    expect(
      depends({ claimantRelationship: 'SPOUSE', hadPreviousMarriages: true }),
    ).to.be.true;

    // Non-spouse (e.g., CHILD) with NO previous marriages -> should show (true)
    expect(
      depends({ claimantRelationship: 'CHILD', hadPreviousMarriages: false }),
    ).to.be.true;

    // Non-spouse with previous marriages true -> still shows (true)
    expect(
      depends({ claimantRelationship: 'CHILD', hadPreviousMarriages: true }),
    ).to.be.true;

    // Edge: Spouse with hadPreviousMarriages undefined -> should skip (false)
    expect(depends({ claimantRelationship: 'SPOUSE' })).to.be.false;

    // Edge: Non-spouse with hadPreviousMarriages undefined -> should show (true)
    expect(depends({ claimantRelationship: 'CHILD' })).to.be.true;
  });
});
