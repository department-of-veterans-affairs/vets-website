import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

describe('Claimant Relationship page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInfo.pages.claimantRelationship;

  // Custom page is rendered, so this only renders a submit button
  it('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should have proper max length for relationshipNotListed field', () => {
    expect(schema.properties.relationshipNotListed.maxLength).to.equal(42);
    expect(uiSchema.relationshipNotListed['ui:options'].maxLength).to.equal(42);
  });
});
