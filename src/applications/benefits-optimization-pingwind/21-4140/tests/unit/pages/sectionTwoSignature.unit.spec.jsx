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
    const properties = page.schema.properties[parentKey].properties;

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

  it('uses inline title for the certification section', () => {
    const ui = page.uiSchema[parentKey];
    const inlineTitle = ui['ui:title'];

    expect(React.isValidElement(inlineTitle)).to.be.true;
    expect(inlineTitle.type).to.equal('h3');
    expect(inlineTitle.props.children).to.equal(
      'Authorization and Certification',
    );
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
    const properties = page.schema.properties[parentKey].properties;

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
});
