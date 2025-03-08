import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';
import { allContacts, noAddressContacts } from '../../pages/contactInformation';

// TO DO - update this unit test!

const {
  schema,
  uiSchema,
} = formConfig.chapters.infoPages.pages.confirmContactInfo;

describe('contact information page', () => {
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
  it('should have ui:required return true', () => {
    // code coverage
    expect(uiSchema['ui:required']()).to.be.true;
  });

  it('should update schema when housingRisk value is true', () => {
    const formData = { housingRisk: true };
    const resultSchema = uiSchema['ui:options'].updateSchema(formData, schema);
    expect(resultSchema.properties.veteran.required).to.deep.equal(
      noAddressContacts,
    );
  });

  it('should not update schema when housingRisk value is false', () => {
    const resultSchema = uiSchema['ui:options'].updateSchema(undefined, schema);
    expect(resultSchema.properties.veteran.required).to.deep.equal(allContacts);
  });
});
