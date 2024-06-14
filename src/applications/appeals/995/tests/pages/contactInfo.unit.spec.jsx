import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

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
});
