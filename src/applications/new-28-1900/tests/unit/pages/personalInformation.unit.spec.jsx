import { expect } from 'chai';
import personalInformation from '../../../pages/personalInformation';

describe('28‑1900 personalInformation page', () => {
  it('displays the fullname & DOB fields', () => {
    expect(personalInformation.uiSchema).to.include.keys(
      'veteranFullName',
      'veteranDateOfBirth',
    );
  });

  it('requires both fullname and DOB in the schema', () => {
    expect(personalInformation.schema.required).to.have.members([
      'veteranFullName',
      'veteranDateOfBirth',
    ]);
  });
});
