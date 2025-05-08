import { expect } from 'chai';
import yearsOfCollegeStudies from '../../../pages/yearsOfCollegeStudies';

describe('28‑1900 yearsOfCollegeStudies page', () => {
  it('displays appropriate field for yearsOfCollegeOrGraduateStudies', () => {
    expect(yearsOfCollegeStudies.uiSchema).to.have.property(
      'yearsOfCollegeOrGraduateStudies',
    );
  });

  it('requires the field in the schema', () => {
    expect(yearsOfCollegeStudies.schema.required).to.include(
      'yearsOfCollegeOrGraduateStudies',
    );
  });
});
