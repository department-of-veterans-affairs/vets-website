import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import formConfig from '../../config/form';

describe('Supplemental Claims Private evidence authorization page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidencePrivateRecordsAuthorization;

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
});
