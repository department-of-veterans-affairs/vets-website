import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import * as mentalHealthSupport from '../../../pages/form0781/mentalHealthSupport';
import {
  mentalHealthSupportPageTitle,
  mentalHealthSupportDescription,
} from '../../../content/mentalHealthSupport';
import { titleWithTag, form0781HeadingTag } from '../../../content/form0781';

describe('Mental health support page', () => {
  it('should define a uiSchema object', () => {
    expect(mentalHealthSupport.uiSchema).to.be.an('object');
  });

  it('should define a schema object', () => {
    expect(mentalHealthSupport.schema).to.be.an('object');
  });

  it('should have the correct title in uiSchema', () => {
    const { container: uiTitleContainer } = render(
      <div>{mentalHealthSupport.uiSchema['ui:title']}</div>,
    );
    const renderedUITitleText = uiTitleContainer.textContent.trim();

    const { container: titleWithTagContainer } = render(
      <div>
        {titleWithTag(mentalHealthSupportPageTitle, form0781HeadingTag)}
      </div>,
    );
    const expectedTitleText = titleWithTagContainer.textContent.trim();

    expect(renderedUITitleText).to.equal(expectedTitleText);
  });

  it('should have the correct description in uiSchema', () => {
    expect(mentalHealthSupport.uiSchema['ui:description']).to.equal(
      mentalHealthSupportDescription,
    );
  });

  it('should have correct schema structure', () => {
    expect(mentalHealthSupport.schema)
      .to.have.property('type')
      .that.equals('object');
    expect(mentalHealthSupport.schema)
      .to.have.property('properties')
      .that.is.an('object');
  });

  it('should not have additional properties in schema', () => {
    const properties = Object.keys(mentalHealthSupport.schema.properties);
    expect(properties).to.have.lengthOf(0);
  });
});
