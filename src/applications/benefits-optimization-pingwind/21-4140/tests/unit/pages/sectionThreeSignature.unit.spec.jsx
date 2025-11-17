import React from 'react';
import { expect } from 'chai';

import sectionThreeSignature from '../../../pages/sectionThreeSignature';
import { employedByVAFields } from '../../../definitions/constants';

describe('21-4140 page/sectionThreeSignature', () => {
  const page = sectionThreeSignature;
  const parentKey = employedByVAFields.parentObject;

  it('requires both certification checkboxes', () => {
    const schema = page.schema.properties[parentKey];
    expect(schema.required).to.deep.equal([
      employedByVAFields.hasCertifiedSection3,
      employedByVAFields.hasUnderstoodSection3,
    ]);
  });

  it('uses checkboxRequiredSchema for certification fields', () => {
    const properties = page.schema.properties[parentKey].properties;

    expect(
      properties[employedByVAFields.hasCertifiedSection3].enum,
    ).to.deep.equal([true]);
    expect(
      properties[employedByVAFields.hasUnderstoodSection3].enum,
    ).to.deep.equal([true]);
  });

  it('configures certification checkbox UI helpers', () => {
    const ui = page.uiSchema[parentKey];

    const certifyUi = ui[employedByVAFields.hasCertifiedSection3];
    expect(certifyUi['ui:required']()).to.be.true;
    expect(certifyUi['ui:errorMessages'].required).to.equal(
      'You must certify that the statements above are true to continue.',
    );

    const understandUi = ui[employedByVAFields.hasUnderstoodSection3];
    expect(understandUi['ui:required']()).to.be.true;
    expect(understandUi['ui:errorMessages'].required).to.equal(
      'You must acknowledge that you understand this statement to continue.',
    );

    expect(ui['ui:order']).to.deep.equal([
      employedByVAFields.hasCertifiedSection3,
      employedByVAFields.hasUnderstoodSection3,
      'view:sectionThreePenaltyAlert',
      'view:sectionThreePrivacyAlert',
      'view:sectionThreeBurdenAlert',
    ]);
  });

  it('includes enum error message for hasCertifiedSection3', () => {
    const ui = page.uiSchema[parentKey];
    const certifyUi = ui[employedByVAFields.hasCertifiedSection3];

    expect(certifyUi['ui:errorMessages'].enum).to.equal(
      'You must certify that the statements above are true to continue.',
    );
  });

  it('includes enum error message for hasUnderstoodSection3', () => {
    const ui = page.uiSchema[parentKey];
    const understandUi = ui[employedByVAFields.hasUnderstoodSection3];

    expect(understandUi['ui:errorMessages'].enum).to.equal(
      'You must acknowledge that you understand this statement to continue.',
    );
  });

  it('has title and description for certification checkboxes', () => {
    const ui = page.uiSchema[parentKey];

    const certifyUi = ui[employedByVAFields.hasCertifiedSection3];
    expect(certifyUi['ui:title']).to.exist;
    expect(React.isValidElement(certifyUi['ui:description'])).to.be.true;

    const understandUi = ui[employedByVAFields.hasUnderstoodSection3];
    expect(understandUi['ui:title']).to.exist;
    expect(React.isValidElement(understandUi['ui:description'])).to.be.true;
  });

  it('configures informational alerts as view fields', () => {
    const ui = page.uiSchema[parentKey];

    [
      'view:sectionThreePenaltyAlert',
      'view:sectionThreePrivacyAlert',
      'view:sectionThreeBurdenAlert',
    ].forEach(viewKey => {
      const viewConfig = ui[viewKey];
      expect(viewConfig['ui:field']).to.equal('ViewField');
      expect(React.isValidElement(viewConfig['ui:description'])).to.be.true;
    });
  });

  it('stubs schema objects for alert fields', () => {
    const properties = page.schema.properties[parentKey].properties;

    [
      'view:sectionThreePenaltyAlert',
      'view:sectionThreePrivacyAlert',
      'view:sectionThreeBurdenAlert',
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

    const certifyUi = ui[employedByVAFields.hasCertifiedSection3];
    expect(certifyUi['ui:options']?.classNames).to.exist;

    const understandUi = ui[employedByVAFields.hasUnderstoodSection3];
    expect(understandUi['ui:options']?.classNames).to.exist;
  });
});
