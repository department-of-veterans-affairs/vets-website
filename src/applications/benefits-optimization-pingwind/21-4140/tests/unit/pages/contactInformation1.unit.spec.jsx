import { expect } from 'chai';

import page from '../../../pages/contactInformation1';
import { veteranFields } from '../../../definitions/constants';

describe('21-4140 page/contactInformation1', () => {
  it('defines the mailing address schema fields', () => {
    const veteranSchema = page.schema.properties[veteranFields.parentObject];
    const addressSchema = veteranSchema.properties[veteranFields.address];

    expect(addressSchema).to.exist;
    expect(addressSchema.properties).to.include.keys([
      'street',
      'city',
      'state',
      'postalCode',
    ]);
  });

  it('requires a primary phone number in schema and UI', () => {
    const veteranSchema = page.schema.properties[veteranFields.parentObject];
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];

    expect(veteranSchema.required).to.include(veteranFields.homePhone);
    expect(veteranUiSchema[veteranFields.homePhone]['ui:required']()).to.be
      .true;
  });
});
