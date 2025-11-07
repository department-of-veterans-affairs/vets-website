import React from 'react';
import { expect } from 'chai';

import sectionTwoSignature from '../../../pages/sectionTwoSignature';
import { employedByVAFields } from '../../../definitions/constants';

describe('21-4140 page/sectionTwoSignature', () => {
  const page = sectionTwoSignature;
  const parentKey = employedByVAFields.parentObject;

  it('requires both certification checkboxes', () => {
    const schema = page.schema.properties[parentKey];
    expect(schema.required).to.deep.equal([
      employedByVAFields.hasCertifiedSection2,
      employedByVAFields.hasUnderstoodSection2,
    ]);
  });

  it('uses checkboxRequiredSchema for certification fields', () => {
    const { properties } = page.schema.properties[parentKey];

    expect(
      properties[employedByVAFields.hasCertifiedSection2].enum,
    ).to.deep.equal([true]);
    expect(
      properties[employedByVAFields.hasUnderstoodSection2].enum,
    ).to.deep.equal([true]);
  });

  it('configures certification checkbox UI helpers', () => {
    const ui = page.uiSchema[parentKey];

    const certifyUi = ui[employedByVAFields.hasCertifiedSection2];
    expect(certifyUi['ui:required']()).to.be.true;
    expect(certifyUi['ui:errorMessages'].required).to.equal(
      'You must certify that the statements above are true to continue.',
    );

    const understandUi = ui[employedByVAFields.hasUnderstoodSection2];
    expect(understandUi['ui:required']()).to.be.true;
    expect(understandUi['ui:errorMessages'].required).to.equal(
      'You must acknowledge that you understand this statement to continue.',
    );

    expect(ui['ui:order']).to.deep.equal([
      employedByVAFields.hasCertifiedSection2,
      employedByVAFields.hasUnderstoodSection2,
      'view:sectionTwoPenaltyAlert',
      'view:sectionTwoPrivacyAlert',
      'view:sectionTwoBurdenAlert',
    ]);
  });

  it('includes enum error message for hasCertifiedSection2', () => {
    const ui = page.uiSchema[parentKey];
    const certifyUi = ui[employedByVAFields.hasCertifiedSection2];

    expect(certifyUi['ui:errorMessages'].enum).to.equal(
      'You must certify that the statements above are true to continue.',
    );
  });

  it('includes enum error message for hasUnderstoodSection2', () => {
    const ui = page.uiSchema[parentKey];
    const understandUi = ui[employedByVAFields.hasUnderstoodSection2];

    expect(understandUi['ui:errorMessages'].enum).to.equal(
      'You must acknowledge that you understand this statement to continue.',
    );
  });

  it('has title and description for certification checkboxes', () => {
    const ui = page.uiSchema[parentKey];

    const certifyUi = ui[employedByVAFields.hasCertifiedSection2];
    expect(certifyUi['ui:title']).to.exist;
    expect(React.isValidElement(certifyUi['ui:description'])).to.be.true;

    const understandUi = ui[employedByVAFields.hasUnderstoodSection2];
    expect(understandUi['ui:title']).to.exist;
    expect(React.isValidElement(understandUi['ui:description'])).to.be.true;
  });

  it('configures informational alerts as view fields', () => {
    const ui = page.uiSchema[parentKey];

    [
      'view:sectionTwoPenaltyAlert',
      'view:sectionTwoPrivacyAlert',
      'view:sectionTwoBurdenAlert',
    ].forEach(viewKey => {
      const viewConfig = ui[viewKey];
      expect(viewConfig['ui:field']).to.equal('ViewField');
      expect(React.isValidElement(viewConfig['ui:description'])).to.be.true;
    });
  });

  it('stubs schema objects for alert fields', () => {
    const { properties } = page.schema.properties[parentKey];

    [
      'view:sectionTwoPenaltyAlert',
      'view:sectionTwoPrivacyAlert',
      'view:sectionTwoBurdenAlert',
    ].forEach(viewKey => {
      expect(properties[viewKey]).to.have.property('type', 'object');
      expect(properties[viewKey])
        .to.have.property('properties')
        .that.deep.equals({});
    });
  });

  it('includes ui:description at page level', () => {
    expect(page.uiSchema['ui:description']).to.exist;
    expect(typeof page.uiSchema['ui:description']).to.equal('function');
  });

  it('renders page level ui:description as React element', () => {
    const description = page.uiSchema['ui:description']();
    expect(React.isValidElement(description)).to.be.true;
  });

  it('has classNames for certification checkbox styling', () => {
    const ui = page.uiSchema[parentKey];

    const certifyUi = ui[employedByVAFields.hasCertifiedSection2];
    expect(certifyUi['ui:options']?.classNames).to.exist;

    const understandUi = ui[employedByVAFields.hasUnderstoodSection2];
    expect(understandUi['ui:options']?.classNames).to.exist;
  });
});
