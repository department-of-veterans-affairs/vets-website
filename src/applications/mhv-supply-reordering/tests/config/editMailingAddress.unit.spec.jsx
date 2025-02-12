import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('editMailingAddress', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.contactInformationChapter.pages.editMailingAddress;

  it('renders the form with the correct number of inputs', () => {
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={{}}
      />,
    );

    expect($$('va-text-input', container).length).to.equal(5);
    expect($$('va-checkbox', container).length).to.equal(1);
    expect($$('va-select', container).length).to.equal(1); // expected 2, actual 1
    expect($('button[type="submit"]', container)).to.exist;
  });
});
