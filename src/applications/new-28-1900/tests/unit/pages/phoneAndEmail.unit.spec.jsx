import { expect } from 'chai';
import phoneAndEmail from '../../../pages/phoneAndEmail';

describe('28‑1900 phoneAndEmail page', () => {
  it('contains four distinct contact information fields', () => {
    expect(phoneAndEmail.uiSchema).to.include.all.keys(
      'phone',
      'cellPhone',
      'internationalPhone',
      'emailAddress',
    );
  });

  it('requires emailAddress but not the phone numbers', () => {
    expect(phoneAndEmail.schema.required).to.deep.equal(['emailAddress']);
  });
});
