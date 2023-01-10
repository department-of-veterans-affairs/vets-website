import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import { $ } from '../../utils/ui';

import formConfig from '../../config/form';

// TO DO - update this unit test!

const {
  schema,
  uiSchema,
} = formConfig.chapters.infoPages.pages.confirmContactInformation;

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
});
