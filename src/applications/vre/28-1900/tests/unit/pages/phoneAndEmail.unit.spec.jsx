import { expect } from 'chai';
import phoneAndEmail from '../../../pages/phoneAndEmail';

describe('28‑1900 phoneAndEmail page', () => {
  it('contains four distinct contact information fields', () => {
    expect(phoneAndEmail.uiSchema).to.include.all.keys(
      'mainPhone',
      'cellPhone',
      'internationalPhone',
      'email',
    );
  });

  it('requires email but not the phone numbers', () => {
    expect(phoneAndEmail.schema.required).to.deep.equal(['email']);
  });
});
