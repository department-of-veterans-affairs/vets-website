import React from 'react';
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

  it('includes ui:description with introduction text', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema['ui:description']).to.exist;
    expect(typeof veteranUiSchema['ui:description']).to.equal('function');
  });

  it('renders ui:description as a React element', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    const description = veteranUiSchema['ui:description']();
    expect(React.isValidElement(description)).to.be.true;
  });

  it('includes all required schema properties', () => {
    const veteranSchema = page.schema.properties[veteranFields.parentObject];
    expect(veteranSchema.properties).to.have.all.keys([
      veteranFields.address,
      veteranFields.email,
      veteranFields.agreeToElectronicCorrespondence,
      veteranFields.homePhone,
      veteranFields.alternatePhone,
    ]);
  });

  it('configures email UI schema', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.email]).to.exist;
  });

  it('configures electronic correspondence checkbox', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    const checkboxUi =
      veteranUiSchema[veteranFields.agreeToElectronicCorrespondence];

    expect(checkboxUi).to.exist;
    expect(checkboxUi['ui:title']).to.exist;
    expect(checkboxUi['ui:options']?.hideEmptyValueInReview).to.be.true;
  });

  it('configures alternate phone with hideEmptyValueInReview option', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    const alternatePhoneUi = veteranUiSchema[veteranFields.alternatePhone];

    expect(alternatePhoneUi).to.exist;
    expect(alternatePhoneUi['ui:options']?.hideEmptyValueInReview).to.be.true;
  });

  it('includes address UI schema configuration', () => {
    const veteranUiSchema = page.uiSchema[veteranFields.parentObject];
    expect(veteranUiSchema[veteranFields.address]).to.exist;
  });

  it('has schema with boolean type for electronic correspondence', () => {
    const veteranSchema = page.schema.properties[veteranFields.parentObject];
    const checkboxSchema =
      veteranSchema.properties[veteranFields.agreeToElectronicCorrespondence];

    expect(checkboxSchema.type).to.equal('boolean');
  });
});
