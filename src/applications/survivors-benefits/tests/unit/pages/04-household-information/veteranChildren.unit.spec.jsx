import { expect } from 'chai';
import page from '../../../../config/chapters/04-household-information/veteranChildren';

describe('Children of Veteran page', () => {
  const { uiSchema, schema } = page;

  it('uiSchema contains expectingChild and hadChildWithVeteran', () => {
    expect(uiSchema).to.be.an('object');
    expect(uiSchema.pregnantWithVeteran, 'expectingChild missing').to.exist;
    expect(uiSchema.childWithVeteran, 'hadChildWithVeteran missing').to.exist;
  });

  it('schema requires expectingChild and hadChildWithVeteran', () => {
    expect(schema).to.be.an('object');
    expect(schema.required).to.include('pregnantWithVeteran');
    expect(schema.required).to.include('childWithVeteran');
  });
});
