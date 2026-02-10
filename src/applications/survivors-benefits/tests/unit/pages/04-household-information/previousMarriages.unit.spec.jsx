import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/spouseMarriages';

describe('Previous marriages page', () => {
  const { uiSchema, schema, depends } = page;

  it('depends function returns true only for claimantRelationship === SURVIVING_SPOUSE', () => {
    expect(depends).to.be.a('function');
    expect(Boolean(depends({ claimantRelationship: 'SURVIVING_SPOUSE' }))).to.be
      .true;
    expect(Boolean(depends({ claimantRelationship: 'CHILD' }))).to.be.false;
    expect(Boolean(depends({}))).to.be.false;
  });

  it('uiSchema contains the expected yes/no questions', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema.recognizedAsSpouse, 'recognizedAsSpouse missing').to.exist;
    expect(uiSchema.hadPreviousMarriages, 'hadPreviousMarriages missing').to
      .exist;
  });

  it('schema requires recognizedAsSpouse and hadPreviousMarriages', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('recognizedAsSpouse');
    expect(schema.required).to.include('hadPreviousMarriages');
  });
});
