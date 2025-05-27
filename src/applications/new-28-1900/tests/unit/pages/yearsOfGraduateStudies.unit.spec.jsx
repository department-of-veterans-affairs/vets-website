import { expect } from 'chai';
import yearsOfGraduateStudies from '../../../pages/yearsOfGraduateStudies';

describe('28‑1900 yearsOfGraduateStudies', () => {
  it('shares the same field name & requirement as the college years page', () => {
    expect(yearsOfGraduateStudies.uiSchema).to.have.property(
      'yearsOfCollegeOrGraduateStudies',
    );
    expect(yearsOfGraduateStudies.schema.required).to.include(
      'yearsOfCollegeOrGraduateStudies',
    );
  });
});
