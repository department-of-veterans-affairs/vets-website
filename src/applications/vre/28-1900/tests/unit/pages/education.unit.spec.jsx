import { expect } from 'chai';
import education from '../../../pages/education';

describe('28‑1900 education page', () => {
  it('displays a yearsOfEducation select field', () => {
    expect(education.uiSchema).to.have.property('yearsOfEducation');
  });

  it('requires yearsOfEducation in the schema', () => {
    expect(education.schema.required).to.include('yearsOfEducation');
  });

  it('keeps UI labels, schema enum, and constants in sync', () => {
    const uiLabels = Object.keys(
      education.uiSchema.yearsOfEducation['ui:options'].labels,
    );
    const enumValues = education.schema.properties.yearsOfEducation.enum;

    expect(uiLabels).to.have.lengthOf(enumValues.length);
    expect(uiLabels).to.deep.equal(enumValues);
  });
});
