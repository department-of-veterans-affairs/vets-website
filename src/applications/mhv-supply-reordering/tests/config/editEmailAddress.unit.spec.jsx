import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('editEmailAddress', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contactInformationChapter.pages.editEmailAddress;

  it('renders the form with the correct number of inputs', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect($$('va-text-input', container).length).to.equal(1);
    expect($('button[type="submit"]', container)).to.exist;
  });
});
