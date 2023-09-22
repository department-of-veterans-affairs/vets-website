import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

describe('Edu 1990 Guardian Information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.GuardianInformation.pages.guardianInformation;

  it('should render', () => {
    const screen = render(
      <DefinitionTester
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        formData={{}}
        uiSchema={uiSchema}
      />,
    );
    expect(screen.queryAllByRole('combobox').length).to.equal(2);
    expect(screen.queryAllByRole('textbox').length).to.equal(11);
  });
});
