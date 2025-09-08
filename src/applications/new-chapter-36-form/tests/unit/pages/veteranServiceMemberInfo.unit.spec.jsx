import { expect } from 'chai';
import veteranServiceMemberInfo from '../../../pages/veteranServiceMemberInfo';

describe('Chapter 36 veteran/service member page', () => {
  it('displays the fullname, DOB, and SSN fields', () => {
    expect(veteranServiceMemberInfo.uiSchema).to.include.keys(
      'fullName',
      'ssn',
      'dob',
    );
  });

  it('requires fullname, DOB, and SSN in the schema', () => {
    expect(veteranServiceMemberInfo.schema.required).to.have.members([
      'fullName',
      'ssn',
      'dob',
    ]);
  });
});
