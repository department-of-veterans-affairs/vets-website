import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/reasonForSeparation';

describe('Reason for separation page', () => {
  const { uiSchema, schema, depends } = page;

  it('depends only when livedContinuouslyWithVeteran is false', () => {
    expect(depends).to.be.a('function');
    expect(Boolean(depends({ livedContinuouslyWithVeteran: false }))).to.be
      .true;
    expect(Boolean(depends({ livedContinuouslyWithVeteran: true }))).to.be
      .false;
    expect(Boolean(depends({}))).to.be.false;
  });

  it('uiSchema contains separationDueToAssignedReasons radio', () => {
    expect(uiSchema).to.be.an('object');
    expect(
      uiSchema.separationDueToAssignedReasons,
      'separationDueToAssignedReasons missing',
    ).to.exist;
  });

  it('schema requires separationDueToAssignedReasons', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('separationDueToAssignedReasons');
  });
});
