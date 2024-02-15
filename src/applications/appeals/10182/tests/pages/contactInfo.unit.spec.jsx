import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../config/form';

describe('NOD contact information page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.infoPages.pages.confirmContactInfo;

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

  it('should update schema when homeless value is true', () => {
    const formData = { homeless: true };
    const resultSchema = uiSchema['ui:options'].updateSchema(formData, schema);
    expect(resultSchema.properties.veteran.required).to.deep.equal([
      'phone',
      'email',
    ]);
  });

  it('should not update schema when homeless value is false', () => {
    const formData = { homeless: false };
    const resultSchema = uiSchema['ui:options'].updateSchema(formData, schema);
    expect(resultSchema.properties.veteran.required).to.deep.equal([
      'address',
      'email',
      'phone',
    ]);
  });

  it('should have ui:required return true', () => {
    // code coverage
    expect(uiSchema['ui:required']()).to.be.true;
  });
});
