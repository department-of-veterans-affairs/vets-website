import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import mockFormData from '../../fixtures/data/form-data.json';
import formConfig from '../../../config/form';

describe('Authorize address page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.authorization.pages.authorizeAddress;

  it.skip('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={mockFormData}
      />,
    );

    expect($('button[type="submit"]', container)).to.exist;
  });
});
