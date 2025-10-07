import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import * as helpers from '../../utils/helpers';
import { uiSchema, schema } from '../../config/pages/veteranApplicantDetails';

describe('veteranApplicantDetails config', () => {
  let stub;

  afterEach(() => {
    if (stub) {
      stub.restore();
      stub = null;
    }
  });

  it('should export a valid schema with required fields', () => {
    expect(schema).to.be.an('object');
    expect(schema.type).to.equal('object');
    expect(schema.properties).to.have.property('application');
    expect(schema.properties.application.type).to.equal('object');
    expect(schema.properties.application.properties).to.have.property(
      'claimant',
    );
    const { claimant } = schema.properties.application.properties;
    expect(claimant.type).to.equal('object');
    expect(claimant.required).to.include.members([
      'name',
      'ssn',
      'dateOfBirth',
    ]);
    expect(claimant.properties).to.have.all.keys(
      'view:applicantDetailsDescription',
      'name',
      'ssn',
      'dateOfBirth',
    );
  });

  it('should export a uiSchema with correct structure', () => {
    const result = uiSchema();
    expect(result).to.be.an('object');
    expect(result).to.have.property('ui:title');
    expect(result.application).to.be.an('object');
    expect(result.application).to.have.property('claimant');
    expect(result.application.claimant).to.have.all.keys(
      'view:applicantDetailsDescription',
      'name',
      'ssn',
      'dateOfBirth',
    );
  });

  it('should use custom subHeader and description when provided', () => {
    const subHeader = 'Custom Subheader';
    const description = 'Custom Description';
    const result = uiSchema(subHeader, description);
    expect(result.application['ui:title']).to.equal(subHeader);
    // This next line assumes your view uses description, update for your impl
    expect(result.application.claimant['view:applicantDetailsDescription']).to
      .exist;
  });

  it('should use custom UI fields when provided', () => {
    const nameUI = { 'ui:widget': 'text' };
    const ssnUI = { 'ui:widget': 'ssn' };
    const dateOfBirthUI = { 'ui:widget': 'date' };
    const result = uiSchema(undefined, undefined, nameUI, ssnUI, dateOfBirthUI);
    expect(result.application.claimant.name).to.equal(nameUI);
    expect(result.application.claimant.ssn).to.equal(ssnUI);
    expect(result.application.claimant.dateOfBirth).to.equal(dateOfBirthUI);
  });

  it('should call veteranApplicantDetailsSummary for ui:title', () => {
    stub = sinon
      .stub(helpers, 'veteranApplicantDetailsSummary')
      .returns('stubbed');
    const result = uiSchema();
    const formContext = { isLoggedIn: true };
    const formData = { baz: 'qux' };
    result['ui:title'](formContext, formData);
    expect(stub.calledOnce).to.be.true;
    expect(stub.calledWith(formContext, formData)).to.be.true;
  });

  it('should render ui:title as a function in a form', () => {
    stub = sinon
      .stub(helpers, 'veteranApplicantDetailsSummary')
      .returns('stubbed');
    const result = uiSchema();
    const TitleComponent = result['ui:title'];
    const formContext = { isLoggedIn: false };
    const formData = {};
    const { container } = render(<>{TitleComponent(formContext, formData)}</>);
    expect(container).to.exist;
  });
});
