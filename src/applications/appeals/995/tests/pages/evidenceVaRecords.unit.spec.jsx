import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import * as evidenceVaDetails from '../../pages/evidenceVaDetails';

describe('Supplemental Claims VA evidence page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.evidence.pages.evidenceVaDetails;

  const uiOptions = uiSchema['ui:options'];

  // Custom page is rendered, so this renders a submit button
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

  it('should set schema to use original VA evidence schema', () => {
    const result = uiOptions.updateSchema();
    expect(result).to.deep.equal(evidenceVaDetails.schema);
  });
});
